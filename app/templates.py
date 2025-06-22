# app/templates.py

project_templates = {
    "python": {
        "beginner": [
            {
                "title": "Simple Budget Tracker",
                "description": "A CLI-based tool to track your daily expenses and visualize your monthly budget.",
                "tools": ["Python", "Matplotlib", "CSV"],
                "file_structure": [
                    "budget_tracker/",
                    "├── tracker.py",
                    "├── expenses.csv",
                    "└── README.md"
                ],
                "bonus": "Add monthly summary graphs with matplotlib pie charts."
            }
        ],
        "intermediate": [
            {
                "title": "Voice-Controlled Notes App",
                "description": "A speech-to-text note-taking app that lets you dictate and save notes using your voice.",
                "tools": ["Python", "SpeechRecognition", "Tkinter", "gTTS"],
                "file_structure": [
                    "voice_notes/",
                    "├── app.py",
                    "├── recognizer.py",
                    "└── README.md"
                ],
                "bonus": "Add voice feedback and text-to-speech playback of saved notes."
            }
        ],
        "advanced": [
            {
                "title": "File Organizer Assistant",
                "description": "An automated assistant that categorizes and moves files on your desktop based on type and last-used date.",
                "tools": ["Python", "os", "shutil", "Datetime"],
                "file_structure": [
                    "file_assistant/",
                    "├── organize.py",
                    "└── README.md"
                ],
                "bonus": "Add GUI with real-time logs using Tkinter or PyQT."
            }
        ],
        "ai": [
            {
                "title": "AI-powered Email Summarizer",
                "description": "A script that reads recent emails (via IMAP), summarizes them using OpenAI API, and creates a daily digest.",
                "tools": ["Python", "IMAPClient", "OpenAI API", "smtplib"],
                "file_structure": [
                    "email_summarizer/",
                    "├── summarizer.py",
                    "├── email_utils.py",
                    "└── README.md"
                ],
                "bonus": "Add voice reading of summaries with pyttsx3."
            }
        ]
    }
}
