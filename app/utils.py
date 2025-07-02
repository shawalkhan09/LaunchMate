# utils.py

def normalize(text):
    return text.lower().strip()

# Allowed platforms per course
allowed_platforms = {
    "python": ["desktop app", "cli tool"],
    "oop": ["desktop app", "cli tool"],
    "dbms": ["web app", "desktop app", "cli tool"],
    "software-engineering": ["web app", "desktop app"],
    "machine-learning": ["desktop app", "cli tool", "web app"],
    "data-science": ["desktop app", "cli tool", "notebook"],
    "web-dev": ["web app"],
    "mobile-dev": ["mobile app"],
    "dsa": ["desktop app", "cli tool"],
    "cloud-computing": ["cli tool", "web app"],
    "cybersecurity": ["desktop app", "cli tool"],
    "devops": ["cli tool", "dashboard", "web app"],
    "ai-and-deep-learning": ["desktop app", "notebook", "web app"],
    "game-dev": ["desktop app", "web app"]
}

# Tools expected per course
allowed_tools = {
    "python": ["python", "tkinter", "flask"],
    "oop": ["python", "java", "tkinter", "javafx"],
    "dbms": ["mysql", "sqlite", "postgresql", "mongodb"],
    "software-engineering": ["html", "css", "js", "react", "firebase"],
    "machine-learning": ["scikit-learn", "pandas", "numpy", "matplotlib"],
    "data-science": ["pandas", "matplotlib", "seaborn", "plotly"],
    "web-dev": ["html", "css", "javascript", "react", "vue", "tailwind", "node.js"],
    "mobile-dev": ["flutter", "kotlin", "react native"],
    "dsa": ["python", "c++", "javascript"],
    "cloud-computing": ["aws", "gcp", "firebase", "docker", "github actions"],
    "cybersecurity": ["nmap", "wireshark", "hashlib", "aes", "python"],
    "devops": ["docker", "jenkins", "terraform", "ansible", "bash"],
    "ai-and-deep-learning": ["tensorflow", "pytorch", "keras", "huggingface"],
    "game-dev": ["phaser", "pygame", "unity", "godot"]
}

# Forbidden keywords (per course)
forbidden_keywords = {
    "game-dev": ["password manager", "mood tracker", "extension", "cli", "resume"],
    "web-dev": ["mobile app", "android", "kotlin", "flutter"],
    "mobile-dev": ["desktop", "cli", "web app"],
    "oop": ["ml", "ai", "transformer", "dl", "cnn"],
    "machine-learning": ["game", "3d engine"],
    "cloud-computing": ["resume", "habit tracker"],
    "cybersecurity": ["game", "3d"],
    "devops": ["mood tracker", "game", "mobile"],
    "ai-and-deep-learning": ["2d platformer", "multiplayer game"]
}


def is_valid_project(course, difficulty, project_data):
    if not project_data:
        return False

    description = normalize(project_data.get("description", ""))
    tools = [normalize(tool) for tool in project_data.get("tools", [])]

    # ❌ Check forbidden keywords
    for bad in forbidden_keywords.get(course, []):
        if bad in description:
            return False

    # ✅ Check required tool overlap
    allowed = allowed_tools.get(course, [])
    if not any(tool in allowed for tool in tools):
        return False

    # ❌ Forbid web projects on mobile-only courses and vice versa
    if course in allowed_platforms:
        valid_platforms = allowed_platforms[course]
        # Try to infer from description
        if any(platform in description for platform in ["mobile", "android", "kotlin", "react native"]):
            if "mobile app" not in valid_platforms:
                return False
        elif any(platform in description for platform in ["browser", "web", "frontend", "react", "html"]):
            if "web app" not in valid_platforms:
                return False
        elif any(platform in description for platform in ["cli", "command-line", "terminal"]):
            if "cli tool" not in valid_platforms:
                return False

    return True
