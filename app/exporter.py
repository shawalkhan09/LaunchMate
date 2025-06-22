import os
import re

def generate_readme(project, folder="saved_projects"):
    readme_content = f"""# {project['title']}

## 📝 Description
{project['description']}

## 🛠️ Tools Used
{', '.join(project['tools'])}

## 📁 File Structure

## 💡 Bonus Suggestion
{project['bonus']}
"""

    # Ensure folder exists
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    folder_path = os.path.join(project_root, folder)

    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    # Clean filename
    filename = re.sub(r'[\\/*?:"<>|]', "", project['title']) + "_README.md"
    filepath = os.path.join(folder_path, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(readme_content)

    return filepath
