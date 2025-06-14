# LaunchMate – AI Prompt Templates & Sample Outputs

This file contains the finalized prompts used for each course. Each prompt is carefully structured to guide the AI into generating a complete, practical, and academically relevant project idea.

---

## 🔸 General Prompt Structure (Template)

> You are an AI assistant for university students. The student has completed the course **[Course Name]** and wants to build a related project. Suggest a creative, realistic project idea that reflects practical use of the course concepts.

Return your response in this format:

1. **Title:**  
2. **One-liner Description:**  
3. **Key Concepts Used:**  
4. **Tools & Technologies Suggested:**  
5. **How It Works (High-Level Logic):**  
6. **Starter File Structure:**  
7. **Stretch Goals or Features (Optional):**  

---

## ✅ Python

**Prompt Used:**

> The user has completed an introductory Python course. Suggest a realistic beginner–intermediate level project that reflects core programming logic in Python. Use the format above.

**Sample Output:**

1. **Title:** Daily Habit Tracker  
2. **One-liner Description:** A terminal-based app that tracks daily habits and displays progress using text-based progress bars.  
3. **Key Concepts Used:** Loops, Functions, Dictionaries, File Handling, DateTime  
4. **Tools & Technologies Suggested:** Python, JSON/CSV, datetime, Rich (optional for colored CLI)  
5. **How It Works:**  
   - Users enter daily habits  
   - App stores habit completion data per day  
   - Loads data and visualizes progress via CLI  
6. **Starter File Structure:**
7. **Stretch Goals:** Add charts, notifications, export to PDF

---

## ✅ Object-Oriented Programming (OOP)

**Prompt Used:**

> The user has completed an OOP course. Suggest a project that applies OOP principles practically. Use the format above.

**Sample Output:**

1. **Title:** Virtual Library Management System  
2. **One-liner Description:** A terminal-based app to manage books, users, and borrowing/returning logic using full OOP design.  
3. **Key Concepts Used:** Classes, Inheritance, Encapsulation, Polymorphism  
4. **Tools & Technologies Suggested:** Python, Pickle or JSON for storage  
5. **How It Works:**  
- User can add/remove/search books  
- Borrowers issue/return books  
- Admin views summary reports  
6. **Starter File Structure:**
7. **Stretch Goals:** GUI with Tkinter or web interface with Flask

---

## ✅ Database Systems

**Prompt Used:**

> The user has completed a database systems course. Suggest a project where they can design and query relational databases. Use the format above.

**Sample Output:**

1. **Title:** University Course Enrollment System  
2. **One-liner Description:** A CRUD-based web app that manages course registrations, using SQL databases to store all academic data.  
3. **Key Concepts Used:** ER Models, Normalization, Joins, Foreign Keys  
4. **Tools & Technologies Suggested:** MySQL or PostgreSQL, Flask, SQLAlchemy  
5. **How It Works:**  
- Admins create courses and student profiles  
- Students register or drop courses  
- All operations are saved and managed via database queries  
6. **Starter File Structure:**
7. **Stretch Goals:** Add login/authentication, transcripts, and PDF reports

---

## ✅ Software Engineering

**Prompt Used:**

> The user has completed a software engineering course. Suggest a project idea where they can apply SDLC principles like planning, modularity, testing, and versioning. Use the format above.

**Sample Output:**

1. **Title:** Bug Tracker & Issue Management Tool  
2. **One-liner Description:** A basic web-based issue tracker for small teams to log, assign, and resolve bugs collaboratively.  
3. **Key Concepts Used:** SDLC Phases, UML, Modular Architecture, Version Control  
4. **Tools & Technologies Suggested:** MERN stack / Flask + SQLite, Git, Trello (for simulation)  
5. **How It Works:**  
- Users can create issues  
- Assign issues by priority/team member  
- Track status across lifecycle  
6. **Starter File Structure:**
7. **Stretch Goals:** Role-based access, analytics dashboard

---

## ✅ Data Science

**Prompt Used:**

> The user has completed a data science fundamentals course. Suggest a project where they can practice data cleaning, visualization, and basic modeling. Use the format above.

**Sample Output:**

1. **Title:** Student Performance Predictor  
2. **One-liner Description:** Analyze student datasets to predict final grades based on study time, attendance, etc.  
3. **Key Concepts Used:** Pandas, Matplotlib, Scikit-learn (Linear Regression)  
4. **Tools & Technologies Suggested:** Python, Jupyter Notebook, CSV  
5. **How It Works:**  
- Load and clean dataset  
- Perform EDA (visuals, correlations)  
- Train simple ML model  
- Predict and display results  
6. **Starter File Structure:**
7. **Stretch Goals:** Streamlit app interface, save model with pickle

---

## 🛠️ More to Come

In future versions, we’ll add:
- Web Development (HTML/CSS/JS-based projects)
- Advanced ML (NLP, image analysis)
- IoT-based ideas
- Business, Finance, and Management domains

