# Welcome to your Project

### Project Info

This project consists of:

- A **Frontend** built with Vite, React, Tailwind CSS, and shadcn-ui.
- A **Backend** built with Python for authentication services.

---

### How can I edit this code?

There are several ways of editing your application.

### Use your preferred IDE

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js, npm, and Python installed.

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install frontend dependencies.
npm i

# Step 4: (Optional) Set up a Python virtual environment for the backend.
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Step 5: Install backend dependencies.
pip install -r requirements.txt

# Step 6: Start the backend server.
python app.py  # or the appropriate main backend file

# Step 7: Start the frontend development server with auto-reloading and instant preview.
npm run dev
