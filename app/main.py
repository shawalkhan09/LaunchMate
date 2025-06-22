from generator import generate_project, save_project_to_file
from exporter import generate_readme

def main():
    course = input("Enter course name: ").lower()
    difficulty = input("Select difficulty [Beginner/Intermediate/Advanced/AI]: ").lower()

    result_text, project_obj = generate_project(course, difficulty)
    if project_obj:
        path_txt = save_project_to_file(project_obj)
        path_md = generate_readme(project_obj)
        return path_txt, path_md
    return None, None

if __name__ == "__main__":
    main()
