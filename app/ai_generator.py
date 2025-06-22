import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def ai_generate_project(course, difficulty):
    api_key = os.getenv('GROQ_API_KEY')

    if not api_key:
        return mock_generate_project(course, difficulty)

    client = Groq(api_key=api_key)

#     prompt = f"""You are a helpful AI that only responds with raw JSON.

# Generate a coding project idea for a {course} course at {difficulty} level.
# Respond ONLY with valid JSON (no markdown, no explanations), using the structure below:

# {{
#     "title": "Project title",
#     "description": "Detailed project description",
#     "tools": ["List of tools and technologies"],
#     "file_structure": ["Directory and file structure"],
#     "bonus": "Optional enhancement suggestion",
#     "learning_outcomes": ["List of learning objectives"],
#     "build_steps": ["Implementation steps"],
#     "estimated_time": "Estimated time to complete",
#     "external_resources": ["Useful links and references"]
# }}

# The project must be practical, educational, and focused on {course} concepts.
# """

    prompt = f"""
        You are an expert AI that specializes in generating **unique, practical, and course-aligned coding project ideas**. 
        Your only task is to respond with raw **JSON** — no markdown, no extra text — in the exact format specified below.

        🎯 Context:
        - Course: {course}
        - Difficulty: {difficulty} level (e.g., beginner, intermediate, advanced)
        - Audience: University students who want hands-on, portfolio-worthy projects

        📦 Requirements:
        - Projects must be unique and engaging — not basic to-do lists or calculators unless deeply extended.
        - Must be tightly aligned with the concepts taught in a {course} course.
        - Encourage creativity, real-world relevance, and problem-solving.
        - Include thoughtful learning outcomes and clear implementation steps.

        🧠 Format:
        Respond ONLY with valid **JSON** using this structure:

        {{
            "title": "Catchy and descriptive project title",
            "description": "Brief but detailed explanation of the problem this project solves and what it does",
            "tools": ["Relevant tools, languages, frameworks, or APIs"],
            "file_structure": ["Suggested folder/file layout"],
            "bonus": "Optional advanced feature or stretch goal",
            "learning_outcomes": ["Key concepts or skills the student will gain"],
            "build_steps": ["Logical implementation steps in sequence"],
            "estimated_time": "Estimated time to complete (realistic and human-readable)",
            "external_resources": ["Links to helpful guides, APIs, libraries, or documentation"]
        }}

        ⛔️ Do not include explanations, commentary, markdown, or headings.
        ✅ Just return the raw JSON object — it must be parsable and complete.
        """


    try:
        completion = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{
                "role": "user",
                "content": prompt
            }],
            temperature=0.7,
            max_tokens=2000,
            top_p=1,
            stream=False
        )

        response_text = completion.choices[0].message.content

        # === Extract valid JSON from response ===
        json_match = re.search(r"\{[\s\S]*\}", response_text)
        if not json_match:
            return mock_generate_project(course, difficulty)

        json_str = json_match.group(0)

        try:
            project_data = json.loads(json_str)
            return project_data
        except json.JSONDecodeError as e:
            return mock_generate_project(course, difficulty)

    except Exception as e:
        return mock_generate_project(course, difficulty)


def mock_generate_project(course, difficulty):

    return {
        "title": f"{difficulty.capitalize()} {course} Helper Bot",
        "description": f"This is a mock project idea for a {difficulty} {course} course. It simulates a useful tool for students to learn key concepts interactively.",
        "tools": ["Python", "Flask", "HTML/CSS", "JavaScript"],
        "file_structure": [
            "project_root/",
            "├── app/",
            "│   ├── main.py",
            "│   ├── routes.py",
            "│   └── templates/",
            "├── static/",
            "│   └── style.css",
            "└── README.md"
        ],
        "bonus": "Add a voice assistant interface using the Web Speech API.",
        "learning_outcomes": ["Apply full-stack web development", "Integrate browser APIs"],
        "build_steps": ["Create Flask backend", "Build HTML templates", "Use Web Speech API for voice features"],
        "estimated_time": "5-8 hours",
        "external_resources": []
    }
