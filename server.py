import os
import logging
import requests
from flask import Flask, request, jsonify, render_template, session, redirect
from app.generator import generate_project, save_project
from app.ai_generator import course_prompt_map
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

app = Flask(__name__)
app.logger.setLevel(logging.INFO)

app.secret_key = os.getenv("FLASK_SECRET_KEY")
if not app.secret_key:
    app.logger.warning("FLASK_SECRET_KEY not set — using a throwaway key; sessions won't survive a restart.")
    app.secret_key = os.urandom(24)

VALID_COURSES = set(course_prompt_map.keys())
VALID_DIFFICULTIES = {"beginner", "intermediate", "advanced"}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        if not email:
            return "Email is required", 400

        try:
            response = supabase.auth.sign_in_with_otp({"email": email})
            return "Check your email for the magic link!"
        except Exception:
            app.logger.exception("Failed to send magic link for %s", email)
            return "Failed to send magic link", 500

    return render_template("login.html")


@app.route("/profile")
def profile():
    if "email" not in session:
        return redirect("/login")
    
    # Fetch user's projects from Supabase
    try:
        user_id = session.get("user_id")
        response = supabase.table("projects").select("*").eq("user_id", user_id).execute()
        projects = response.data
    except Exception:
        app.logger.exception("Failed to fetch projects for user %s", session.get("user_id"))
        projects = []
    
    return render_template("profile.html", email=session["email"], projects=projects)

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

@app.route("/api/generate", methods=["POST"])
def api_generate():
    data = request.get_json(silent=True)

    if not data or not data.get("course") or not data.get("difficulty"):
        return jsonify({"error": "Missing course or difficulty"}), 400

    course = data["course"].strip().lower()
    difficulty = data["difficulty"].strip().lower()

    if course not in VALID_COURSES or difficulty not in VALID_DIFFICULTIES:
        return jsonify({"error": "Unknown course or difficulty"}), 400

    title, project_data = generate_project(course, difficulty)

    if not project_data:
        return jsonify({"error": "Failed to generate project"}), 500

    return jsonify(project_data)

@app.route("/view-project/<project_id>")
def view_project(project_id):
    if "user_id" not in session:
        return redirect("/login")
    
    try:
        # Fetch project details
        project = supabase.table("projects").select("*").eq("id", project_id).eq("user_id", session["user_id"]).execute()
        
        if not project.data:
            return "Project not found or unauthorized", 404
            
        project_data = project.data[0]
        return render_template("project.html", project=project_data)
    except Exception:
        app.logger.exception("Failed to load project %s", project_id)
        return "Error loading project", 500

@app.route("/auth/callback", methods=["POST"])
def auth_callback():
    try:
        access_token = request.json.get("access_token")
        if not access_token:
            return jsonify({"error": "No access token provided"}), 400

        headers = {
            "Authorization": f"Bearer {access_token}",
            "apikey": SUPABASE_ANON_KEY
        }
        response = requests.get(f"{SUPABASE_URL}/auth/v1/user", headers=headers)

        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch user"}), 401

        user_info = response.json()
        user_id = user_info["id"]
        email = user_info["email"]

        session["user_id"] = user_id
        session["email"] = email

    # ✅ INSERT INTO CUSTOM USERS TABLE IF NOT EXISTS
        existing_user = supabase.table("users").select("id").eq("id", user_id).execute()
        if not existing_user.data:
            supabase.table("users").insert({
                "id": user_id,
                "email": email,
            }).execute()
        
        return redirect("/profile")
    except Exception:
        app.logger.exception("Auth callback failed")
        return jsonify({"error": "Failed to create or verify user"}), 500

@app.route("/delete-project/<project_id>", methods=["DELETE"])
def delete_project(project_id):
    if "user_id" not in session:
        return jsonify({"error": "You must be logged in to delete projects."}), 401

    user_id = session.get("user_id")
    
    try:
        # Verify the project belongs to the user before deleting
        project = supabase.table("projects").select("*").eq("id", project_id).eq("user_id", user_id).execute()
        
        if not project.data:
            return jsonify({"error": "Project not found or unauthorized"}), 404
            
        supabase.table("projects").delete().eq("id", project_id).eq("user_id", user_id).execute()
        return jsonify({"success": True})
    except Exception:
        app.logger.exception("Failed to delete project %s", project_id)
        return jsonify({"error": "Error deleting project"}), 500

@app.route("/save-project", methods=["POST"])
def save_project_route():
    if "user_id" not in session:
        return jsonify({"error": "You must be logged in to save projects."}), 401

    data = request.get_json()
    title = data.get("title")
    course = data.get("course")
    description = data.get("description")
    tags = data.get("tags", "")

    # 🔒 Ensure tags is a list and format for PostgreSQL array
    if isinstance(tags, str):
        tags = [tag.strip() for tag in tags.split(",")]
    elif not isinstance(tags, list):
        tags = []

    user_id = session.get("user_id")

    if not all([title, course, description]):
        return jsonify({"error": "Missing project information to save"}), 400

    try:
        # Extract additional project information if available
        tools = data.get("tools", [])
        file_structure = data.get("file_structure", [])
        bonus = data.get("bonus", "")
        learning_outcomes = data.get("learning_outcomes", [])
        build_steps = data.get("build_steps", [])
        estimated_time = data.get("estimated_time", "")
        external_resources = data.get("external_resources", [])

        supabase.table("projects").insert({
            "user_id": user_id,
            "title": title,
            "course": course,
            "description": description,
            "tags": tags,  # PostgreSQL will automatically handle the array format
            "tools": tools,
            "file_structure": file_structure,
            "bonus": bonus,
            "learning_outcomes": learning_outcomes,
            "build_steps": build_steps,
            "estimated_time": estimated_time,
            "external_resources": external_resources
        }).execute()
        return jsonify({"success": True})
    except Exception:
        app.logger.exception("Failed to save project for user %s", user_id)
        return jsonify({"error": "Error saving project"}), 500



if __name__ == "__main__":
    app.run(debug=True)
