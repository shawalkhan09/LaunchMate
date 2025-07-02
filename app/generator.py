from app.ai_generator import ai_generate_project
import os
import re
from app.supabase_client import supabase
from flask import session

def generate_project(course_name, difficulty):
    try:
        project = ai_generate_project(course_name, difficulty)
        
        if not project:
            return None, None
            
        formatted_project = format_project(project)
        return formatted_project, project
    except Exception as e:
        return None, None

def format_project(project):
    return f"""
Title: {project['title']}

Description:
{project['description']}

Tools Required:
{', '.join(project['tools'])}

Suggested File Structure:
{chr(10).join(project['file_structure'])}

Bonus Suggestion:
{project['bonus']}

Learning Outcomes:
{chr(10).join('- ' + outcome for outcome in project.get('learning_outcomes', []))}

Build Steps:
{chr(10).join(f"{i+1}. {step}" for i, step in enumerate(project.get('build_steps', [])))}

Useful APIs:
{chr(10).join(project.get('api_links', []))}

Estimated Time to Build:
{project.get('estimated_time', '—')}
"""

def save_project_to_file(project, folder="saved_projects"):
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    folder_path = os.path.join(project_root, folder)

    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    filename = re.sub(r'[\\/*?:"<>|]', "", project['title']) + ".md"
    filepath = os.path.join(folder_path, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(format_project(project))

    return filepath

def save_project(title, course, description, tags, user_id=None, project_data=None):
    if not user_id:
        print("❌ Cannot save project — no user ID")
        return

    try:
        # Extract additional fields from project_data if available
        project_details = {
            "title": title,
            "course": course,
            "description": description,
            "tags": tags,
            "user_id": user_id,
            "tools": project_data.get("tools", []) if project_data else [],
            "file_structure": project_data.get("file_structure", []) if project_data else [],
            "bonus": project_data.get("bonus", "") if project_data else "",
            "learning_outcomes": project_data.get("learning_outcomes", []) if project_data else [],
            "build_steps": project_data.get("build_steps", []) if project_data else [],
            "estimated_time": project_data.get("estimated_time", "") if project_data else "",
            "external_resources": project_data.get("external_resources", []) if project_data else []
        }

        response = supabase.table("projects").insert(project_details).execute()
        print("✅ Project saved:", response)
    except Exception as e:
        print("❌ Error saving project:", e)

