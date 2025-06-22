# 🚀 LaunchMate – AI-Powered Project Idea Generator

LaunchMate is a productivity tool that helps university students generate personalized project ideas based on their course and difficulty level. It leverages the Groq AI API to provide structured, meaningful, and implementable project suggestions.

---

## 🧠 How It Works

1. Select your course and difficulty level
2. Click "Generate Project"
3. The Groq AI API generates a customized project idea
4. Receive detailed project specifications including:
   - Project title and description
   - Required tools and technologies
   - Suggested file structure
   - Learning outcomes
   - Build steps
   - Bonus features
   - Estimated completion time
   - External resources

---

## 🖥️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python, Flask
- **AI Integration:** Groq API with llama3-70b-8192 model
- **Data Storage:** Local file system for saved projects
- **Environment:** Python virtual environment

---

## 📁 Project Structure

```
launchmate/
├── app/
│   ├── __init__.py         # Package initialization
│   ├── ai_generator.py     # Groq API integration
│   ├── generator.py        # Project generation logic
│   ├── exporter.py         # Project export functionality
│   ├── templates.py        # Response templates
│   └── utils.py           # Utility functions
├── static/
│   ├── style.css          # Frontend styling
│   └── script.js          # Frontend interactions
├── templates/
│   └── index.html         # Main frontend page
├── docs/                  # Project documentation
├── saved_projects/        # Generated project files
├── server.py             # Flask application
├── requirements.txt      # Python dependencies
└── README.md            # Project documentation
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- A Groq API key

### 2. Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/shawalkhan09/launchmate.git
cd launchmate
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

### 3. Configuration

1. Create a `.env` file in the project root:
```bash
GROQ_API_KEY=your_groq_api_key_here
```

2. Replace `your_groq_api_key_here` with your actual Groq API key

### 4. Running the Application

1. Start the Flask server:
```bash
python server.py
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

---

## 🔧 Features

- **AI-Powered Generation:** Uses Groq's Mixtral-8x7b model for intelligent project suggestions
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