import os
import json
import re
import random
from groq import Groq
from dotenv import load_dotenv
from app.utils import is_valid_project

load_dotenv()

# Load fallback project ideas from file
with open('fallback_projects.json', 'r') as f:
    fallback_projects = json.load(f)

def get_fallback_project(course, difficulty):
    key = f"{course}:{difficulty}".lower()
    return fallback_projects.get(key)

# 🎯 Individual course-specific prompt templates

python_prompt = """
You are an expert AI that specializes in generating **unique, beginner-friendly, and practical Python project ideas**. 

🎯 Context:
- Course: Python Programming
- Audience: University students looking to build hands-on skills
- Difficulty Level: {difficulty}
- Theme: {theme}
- Twist: {twist}
- Platform: {platform}

🧠 Instructions:
- Suggest a creative project idea that solves a real-world or educational problem
- Ensure it is appropriate for the specified difficulty level
- Leverage Python’s strengths (e.g., simplicity, libraries, scripting power)
- Incorporate the twist and platform where relevant

✅ Output Format:
Respond ONLY with **valid JSON** in the following structure — no explanations, comments, or markdown.

{{
  "title": "...",
  "description": "...",
  "tools": ["..."],
  "file_structure": ["..."],
  "bonus": "...",
  "learning_outcomes": ["..."],
  "build_steps": ["..."],
  "estimated_time": "...",
  "external_resources": ["..."]
}}
"""
oop_prompt = """
You are an expert AI that specializes in generating **hands-on, object-oriented programming project ideas** for university students.

🎯 Context:
- Course: Object-Oriented Programming (OOP)
- Audience: Students learning to apply OOP principles practically
- Difficulty Level: {difficulty}
- Theme: {theme}
- Twist: {twist}
- Platform: {platform}

🧠 Instructions:
- Design a project that reinforces OOP fundamentals: classes, objects, inheritance, polymorphism, encapsulation, and abstraction
- Ensure the project includes multiple interacting classes with realistic behaviors and relationships
- Make it engaging and appropriately challenging for the specified difficulty
- Incorporate the twist and platform where relevant

✅ Output Format:
Respond ONLY with **valid JSON** in the following structure — no explanations, comments, or markdown.

{{
  "title": "...",
  "description": "...",
  "tools": ["..."],
  "file_structure": ["..."],
  "bonus": "...",
  "learning_outcomes": ["..."],
  "build_steps": ["..."],
  "estimated_time": "...",
  "external_resources": ["..."]
}}
"""
dbms_prompt = """
You are an expert AI that specializes in generating **practical, real-world DBMS project ideas** for university students.

🎯 Context:
- Course: Database Management Systems (DBMS)
- Audience: Students learning relational databases and data modeling
- Difficulty Level: {difficulty}
- Theme: {theme}
- Twist: {twist}
- Platform: {platform}

🧠 Instructions:
- Design a project that involves database design using ER models and conversion to relational schema
- Include CRUD operations, relational queries (SQL), and at least one form of constraint or normalization concept
- Make it realistic and relatable (e.g., inventory system, course registration, health records)
- Incorporate the twist and platform where relevant (e.g., web-based SQL dashboard, mobile DB viewer)

✅ Output Format:
Respond ONLY with **valid JSON** in the following structure — no explanations, comments, or markdown.

{{
  "title": "...",
  "description": "...",
  "tools": ["..."],
  "file_structure": ["..."],
  "bonus": "...",
  "learning_outcomes": ["..."],
  "build_steps": ["..."],
  "estimated_time": "...",
  "external_resources": ["..."]
}}
"""

se_prompt = """
You are an expert AI that specializes in generating **software engineering project ideas** that simulate real-world product development processes.

🎯 Context:
- Course: Software Engineering
- Audience: Students learning SDLC, modular design, teamwork, and quality assurance
- Difficulty Level: {difficulty}
- Theme: {theme}
- Twist: {twist}
- Platform: {platform}

🧠 Instructions:
- Propose a full-cycle software project that reflects planning, requirement analysis, design, implementation, testing, and maintenance
- Emphasize good software practices (modularity, version control, documentation, testing)
- The project should involve multiple modules or components working together
- Incorporate the twist and platform to make it more creative or constrained

✅ Output Format:
Respond ONLY with **valid JSON** in the following structure — no explanations, comments, or markdown.

{{
  "title": "...",
  "description": "...",
  "tools": ["..."],
  "file_structure": ["..."],
  "bonus": "...",
  "learning_outcomes": ["..."],
  "build_steps": ["..."],
  "estimated_time": "...",
  "external_resources": ["..."]
}}
"""

ml_prompt = """
You are an expert AI that specializes in generating **realistic and educational machine learning project ideas** for university students.

🎯 Context:
- Course: Machine Learning
- Audience: Students who have learned basic ML concepts and want to apply them practically
- Difficulty Level: {difficulty}
- Theme: {theme}
- Twist: {twist}
- Platform: {platform}

🧠 Instructions:
- Suggest a project that uses supervised, unsupervised, or basic deep learning techniques
- Emphasize key ML steps: data collection/preprocessing, model training, evaluation, and performance improvement
- Focus on interpretability, real-world datasets, and ethical use of AI when relevant
- Avoid overly complex models (e.g., transformers) unless appropriate for difficulty
- Incorporate the twist and platform (e.g., mobile ML app, web-based dashboard, CLI model explorer)

✅ Output Format:
Respond ONLY with **valid JSON** in the following structure — no explanations, comments, or markdown.

{{
  "title": "...",
  "description": "...",
  "tools": ["..."],
  "file_structure": ["..."],
  "bonus": "...",
  "learning_outcomes": ["..."],
  "build_steps": ["..."],
  "estimated_time": "...",
  "external_resources": ["..."]
}}
"""

ds_prompt = """
You are an expert AI that specializes in generating **data science project ideas** that help students master real-world data analysis and storytelling.

🎯 Context:
- Course: Data Science
- Audience: University students learning data preprocessing, analysis, and visualization
- Difficulty Level: {difficulty}
- Theme: {theme}
- Twist: {twist}
- Platform: {platform}

🧠 Instructions:
- Propose a project that involves sourcing or using a public dataset
- Emphasize data cleaning, exploratory data analysis (EDA), and insight generation
- Include meaningful visualizations and data storytelling aspects
- Optionally, include simple ML or statistical modeling (if difficulty allows)
- Incorporate the twist and platform — e.g., interactive dashboard, report generator, or terminal-based data explorer

✅ Output Format:
Respond ONLY with **valid JSON** in the following structure — no explanations, comments, or markdown.

{{
  "title": "...",
  "description": "...",
  "tools": ["..."],
  "file_structure": ["..."],
  "bonus": "...",
  "learning_outcomes": ["..."],
  "build_steps": ["..."],
  "estimated_time": "...",
  "external_resources": ["..."]
}}
"""

webdev_prompt = """
You are an expert AI that specializes in generating **creative and practical web development project ideas** for university students.

🎯 Context:
- Course: Web Development
- Audience: Students learning to build full-stack or front-end web applications
- Difficulty Level: {difficulty}
- Theme: {theme}
- Twist: {twist}
- Platform: {platform}

🧠 Instructions:
- Suggest a project that requires building a responsive and interactive website or web app
- Frontend could use HTML, CSS, JS, React, etc.
- Backend (if relevant) could use Node.js, Django, Flask, etc.
- Emphasize good UI/UX, routing, form handling, APIs, or authentication (depending on level)
- Incorporate the twist and platform (e.g., progressive web app, offline mode, mobile-first UI)

✅ Output Format:
Respond ONLY with **valid JSON** in the following structure — no explanations, comments, or markdown.

{{
  "title": "...",
  "description": "...",
  "tools": ["..."],
  "file_structure": ["..."],
  "bonus": "...",
  "learning_outcomes": ["..."],
  "build_steps": ["..."],
  "estimated_time": "...",
  "external_resources": ["..."]
}}
"""

mobiledev_prompt = """
You are an expert AI that specializes in generating **hands-on mobile app development project ideas** for university students.

🎯 Context:
- Course: Mobile App Development
- Audience: Students learning to build cross-platform or native mobile apps
- Difficulty Level: {difficulty}
- Theme: {theme}
- Twist: {twist}
- Platform: {platform}

🧠 Instructions:
- Propose a mobile app that solves a real-world or educational problem
- It should involve multiple screens, local storage (SQLite/shared prefs), and user interaction
- May use Flutter, React Native, Swift, or Kotlin depending on the platform
- Emphasize good UX, offline capability, and device features (camera, notifications, GPS, etc.)
- Incorporate the twist and platform appropriately (e.g., works offline, gamified, dashboard view)

✅ Output Format:
Respond ONLY with **valid JSON** in the following structure — no explanations, comments, or markdown.

{{
  "title": "...",
  "description": "...",
  "tools": ["..."],
  "file_structure": ["..."],
  "bonus": "...",
  "learning_outcomes": ["..."],
  "build_steps": ["..."],
  "estimated_time": "...",
  "external_resources": ["..."]
}}
"""

dsa_prompt = """
You are an expert AI that specializes in generating **practical and educational DSA (Data Structures and Algorithms) project ideas** for university students.

🎯 Context:
- Course: Data Structures and Algorithms (DSA)
- Audience: Students learning to implement and apply core data structures and algorithms
- Difficulty Level: {difficulty}
- Theme: {theme}
- Twist: {twist}
- Platform: {platform}

🧠 Instructions:
- Design a project that requires students to implement key data structures (e.g., stacks, trees, graphs, hash tables)
- The project must include at least one core algorithm (e.g., sorting, searching, traversal, dynamic programming)
- Emphasize hands-on understanding, logic building, and optional visualization of execution
- The project may be applied in games, simulations, problem solvers, or productivity tools
- Incorporate the twist and platform (e.g., CLI visualizer, web-based sorting app, mobile pathfinder)

✅ Output Format:
Respond ONLY with **valid JSON** in the following structure — no explanations, comments, or markdown.

{{
  "title": "...",
  "description": "...",
  "tools": ["..."],
  "file_structure": ["..."],
  "bonus": "...",
  "learning_outcomes": ["..."],
  "build_steps": ["..."],
  "estimated_time": "...",
  "external_resources": ["..."]
}}
"""

cloud_prompt = """
You are an expert AI that specializes in generating **cloud computing project ideas** that help students gain hands-on experience with modern cloud platforms.

🎯 Context:
- Course: Cloud Computing
- Audience: University students learning deployment, scalability, and cloud-native services
- Difficulty Level: {difficulty}
- Theme: {theme}
- Twist: {twist}
- Platform: {platform}

🧠 Instructions:
- Design a project that involves deploying an application using cloud platforms (AWS, Azure, GCP, etc.)
- Include core cloud concepts like storage (S3, Blob), serverless functions, databases, auto-scaling, or monitoring
- Can involve building or migrating a web/mobile app to the cloud
- Emphasize CI/CD pipelines, infrastructure-as-code, or containerization if relevant
- Incorporate the twist and platform appropriately (e.g., works offline but syncs to cloud, cost-optimized, deploys with one click)

✅ Output Format:
Respond ONLY with **valid JSON** in the following structure — no explanations, comments, or markdown.

{{
  "title": "...",
  "description": "...",
  "tools": ["..."],
  "file_structure": ["..."],
  "bonus": "...",
  "learning_outcomes": ["..."],
  "build_steps": ["..."],
  "estimated_time": "...",
  "external_resources": ["..."]
}}
"""

cyber_prompt = """
You are an expert AI that specializes in generating **cybersecurity project ideas** for university students learning ethical hacking and secure system design.

🎯 Context:
- Course: Cybersecurity
- Audience: Students learning about vulnerabilities, encryption, authentication, and secure systems
- Difficulty Level: {difficulty}
- Theme: {theme}
- Twist: {twist}
- Platform: {platform}

🧠 Instructions:
- Design a project that explores key cybersecurity principles such as password hashing, encryption/decryption, threat modeling, or secure authentication
- Can simulate security tools (e.g., password strength checker, phishing detector, encrypted chat)
- May involve building secure systems or demonstrating known vulnerabilities in a safe environment
- Encourage ethical behavior and defensive thinking
- Incorporate the twist and platform appropriately (e.g., CLI-based pentest tool, browser extension, Android app with secure login)

✅ Output Format:
Respond ONLY with **valid JSON** in the following structure — no explanations, comments, or markdown.

{{
  "title": "...",
  "description": "...",
  "tools": ["..."],
  "file_structure": ["..."],
  "bonus": "...",
  "learning_outcomes": ["..."],
  "build_steps": ["..."],
  "estimated_time": "...",
  "external_resources": ["..."]
}}
"""

devops_prompt = """
You are an expert AI that specializes in generating **DevOps project ideas** that help students automate, monitor, and manage modern software delivery systems.

🎯 Context:
- Course: DevOps
- Audience: University students learning about CI/CD, automation, and infrastructure management
- Difficulty Level: {difficulty}
- Theme: {theme}
- Twist: {twist}
- Platform: {platform}

🧠 Instructions:
- Design a project that focuses on automating software delivery pipelines using tools like GitHub Actions, Jenkins, or GitLab CI
- Encourage use of Docker, Kubernetes, or Terraform for deployment and infrastructure management
- Include monitoring/logging (e.g., Prometheus, Grafana), automated testing, and deployment workflows
- The project should reflect a complete lifecycle from development to deployment
- Incorporate the twist and platform appropriately (e.g., deploy to cloud via CI/CD, automate security scans, show real-time build status)

✅ Output Format:
Respond ONLY with **valid JSON** in the following structure — no explanations, comments, or markdown.

{{
  "title": "...",
  "description": "...",
  "tools": ["..."],
  "file_structure": ["..."],
  "bonus": "...",
  "learning_outcomes": ["..."],
  "build_steps": ["..."],
  "estimated_time": "...",
  "external_resources": ["..."]
}}
"""

ai_prompt = """
You are an expert AI that specializes in generating **AI and Deep Learning project ideas** that help university students build intelligent, model-driven applications.

🎯 Context:
- Course: AI and Deep Learning
- Audience: Students learning to build neural networks, apply pre-trained models, and understand deep learning architectures
- Difficulty Level: {difficulty}
- Theme: {theme}
- Twist: {twist}
- Platform: {platform}

🧠 Instructions:
- Design a project that uses deep learning models for tasks like image recognition, sentiment analysis, object detection, or sequence prediction
- The project can involve training from scratch or fine-tuning pre-trained models (e.g., CNNs, RNNs, Transformers)
- Include essential steps: dataset handling, model building, evaluation, and result interpretation
- Consider ethical implications and efficiency trade-offs
- Incorporate the twist and platform appropriately (e.g., voice-based mobile app, real-time detection in browser, offline image classifier)

✅ Output Format:
Respond ONLY with **valid JSON** in the following structure — no explanations, comments, or markdown.

{{
  "title": "...",
  "description": "...",
  "tools": ["..."],
  "file_structure": ["..."],
  "bonus": "...",
  "learning_outcomes": ["..."],
  "build_steps": ["..."],
  "estimated_time": "...",
  "external_resources": ["..."]
}}
"""

gamedev_prompt = """
You are an expert AI that specializes in generating **game development project ideas** for students learning to build interactive, logic-driven applications.

🎯 Context:
- Course: Game Development
- Audience: University students learning game mechanics, design, and implementation
- Difficulty Level: {difficulty}
- Theme: {theme}
- Twist: {twist}
- Platform: {platform}

🧠 Instructions:
- Suggest a project that involves designing and coding a playable game with meaningful user interaction
- Focus on mechanics like scoring, levels, physics, AI behavior, or player progression
- Can use engines like Unity, Unreal, Godot, or simple HTML5/canvas for 2D games
- Emphasize code structure, game loop, asset management, and performance
- Incorporate the twist and platform creatively (e.g., gamify a real-world process, make it multiplayer, add accessibility)

✅ Output Format:
Respond ONLY with **valid JSON** in the following structure — no explanations, comments, or markdown.

{{
  "title": "...",
  "description": "...",
  "tools": ["..."],
  "file_structure": ["..."],
  "bonus": "...",
  "learning_outcomes": ["..."],
  "build_steps": ["..."],
  "estimated_time": "...",
  "external_resources": ["..."]
}}
"""


# 🔑 Map course names to prompt variable names
course_prompt_map = {
    "python": "python_prompt",
    "oop": "oop_prompt",
    "dbms": "dbms_prompt",
    "software-engineering": "se_prompt",
    "machine-learning": "ml_prompt",
    "data-science": "ds_prompt",
    "web-dev": "webdev_prompt",
    "mobile-dev": "mobiledev_prompt",
    "dsa": "dsa_prompt",
    "cloud-computing": "cloud_prompt",
    "cybersecurity": "cyber_prompt",
    "devops": "devops_prompt",
    "ai-and-deep-learning": "ai_prompt",
    "game-dev": "gamedev_prompt"
}

# 🧠 Prompt fetcher with variable injection
def get_prompt(course, difficulty, theme, twist, platform):
    course = course.strip().lower().replace("_", "-")
    course_key = course_prompt_map.get(course)
    if not course_key:
        print(f"[Prompt Error] Unknown course: {course}")
        return None

    prompt_template = globals().get(course_key)
    if not prompt_template:
        print(f"[Prompt Error] Prompt not found for key: {course_key}")
        return None

    return prompt_template.format(
        difficulty=difficulty,
        theme=theme,
        twist=twist,
        platform=platform
    )

# 🚀 Main AI project generator
def ai_generate_project(course, difficulty):
    api_key = os.getenv('GROQ_API_KEY')
    if not api_key:
        print("[Groq Error] Missing API key")
        return get_fallback_project(course, difficulty)

    client = Groq(api_key=api_key)

    themes = ["mental health", "education", "sustainability", "career development", "data security", "productivity"]
    twists = ["must use a public API", "targets non-tech users", "uses gamification", "works offline", "features real-time data"]
    platforms = ["web app", "mobile app", "desktop app", "CLI tool"]

    selected_theme = random.choice(themes)
    selected_twist = random.choice(twists)
    selected_platform = random.choice(platforms)

    prompt = get_prompt(course, difficulty, selected_theme, selected_twist, selected_platform)
    if not prompt:
        return get_fallback_project(course, difficulty)

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8,
            top_p=0.9,
            max_tokens=2048
        )

        response = completion.choices[0].message.content
        print("[🧠 AI Response Raw]:", response)

        start = response.find('{')
        end = response.rfind('}') + 1
        json_str = response[start:end]

        data = json.loads(json_str)

        # Validate required fields
        required_fields = ["title", "description", "tools", "file_structure", "bonus", "learning_outcomes", "build_steps", "estimated_time", "external_resources"]
        if not all(field in data for field in required_fields):
            raise ValueError("Missing required fields in response")

        if not is_valid_project(course, difficulty, data):
            print("[AI Error] Generated project failed course/tool validation")
            return get_fallback_project(course, difficulty)

        return data

    except Exception as e:
        print(f"[AI Error] {e}")
        return get_fallback_project(course, difficulty)
