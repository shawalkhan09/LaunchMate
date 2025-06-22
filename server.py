from flask import Flask, request, jsonify, render_template
from app.generator import generate_project

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    print("🟢 Incoming data:", data)
    if not data or not data.get("course") or not data.get("difficulty"):
        return jsonify({"error": "Missing course or difficulty"}), 400

    _, project_data = generate_project(data["course"], data["difficulty"])
    print("🟡 Generated project:", project_data)
    
    if not project_data:
        return jsonify({"error": "Failed to generate project"}), 500

    return jsonify(project_data)


if __name__ == "__main__":
    app.run(debug=True)
