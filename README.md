# 🚀 LaunchMate – AI-Powered Project Idea Generator

LaunchMate is a productivity tool that helps university students generate **practical, course-aligned project ideas** using AI. It now supports **user profiles, project history**, and a smarter, prompt-engineered system for **accurate project generation**.

---

## 🧠 How It Works

1. Select your course and difficulty level
2. Click **Generate Project**
3. Google Gemini generates a structured, implementable project idea
4. Get a full project spec, including:
   - 📌 Title & Description
   - 🛠 Tools & Technologies
   - 🗂 Suggested File Structure
   - 📘 Learning Outcomes
   - 🧱 Build Steps
   - ✨ Bonus Feature
   - ⏱ Estimated Completion Time
   - 🔗 External Resources

---

## ✨ What's New in v1.1

- ✅ **User Sign-in with Supabase Magic Link Auth**
- ✅ **Database-backed project saving (Supabase)**
- ✅ **Saved project history in user profile**
- ✅ **Fully responsive UI for mobile and desktop**
- ✅ **Copy to Clipboard** functionality for quick access
- ✅ **Individualized Prompting for 14 Courses**
- 🧠 Solved LLM hallucination issue through **course-specific prompts**
- 📌 Published research-backed [LinkedIn article on Prompt Engineering](https://www.linkedin.com/in/your-link)

---

## 🖥️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Python, Flask
- **AI Integration**: Google Gemini API
- **Database**: Supabase (PostgreSQL + Auth)
- **Hosting**: PythonAnywhere (for v1.0), [TBD for v1.1]
- **Design System**: TailwindCSS-inspired styling

---


## 📁 Project Structure

```
launchmate/
├── app/
│   ├── generator.py         # Project generation logic
│   ├── ai_generator.py      # Handles communication with Gemini API
│   ├── templates.py         # Course-specific prompt templates
│   ├── utils.py             # Helper functions (e.g., fallback logic)
│   ├── supabase_client.py   # Supabase DB and Auth integration
│   ├── exporter.py          # Project README exporter (if used)
│   └── main.py              # Entry point for backend logic (if separated)
│
├── static/
│   ├── style.css            # Tailwind-based styling
│   └── script.js            # Frontend logic and interactions
|   └── output.css  
│
├── templates/
│   ├── index.html           # Homepage
│   ├── profile.html         # User profile view
│   ├── login.html           # Supabase Magic Link sign-in
│   └── project.html         # Individual project detail view
│
├── fallback_projects.json   # JSON-based project backup if API fails
├── server.py                # Flask server (main app entrypoint)
├── .env                     # Environment variables (Gemini + Supabase)
├── requirements.txt         # Python dependencies
└── README.md                # This documentation file

---

## 🔧 Features

- **AI-Powered Generation:** Uses Google's Gemini model for intelligent project suggestions
- **Course-Specific:** Tailored to different courses and subjects
- **Difficulty Levels:** Adjustable project complexity
- **Structured Output:** Comprehensive project specifications
- **Local Storage:** Save generated projects for later reference
- **Export Options:** Generate README files for projects
- **Error Handling:** Robust error management with fallback options

---

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.