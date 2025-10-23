# 📦 Installation Guide

This guide will help you set up English Journey on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- ✅ **Node.js** (v16.x or higher) - [Download](https://nodejs.org/)
- ✅ **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- ✅ **Git** - [Download](https://git-scm.com/)
- ✅ **OpenAI API Key** - [Get it here](https://platform.openai.com/api-keys)

Check your installations:
```bash
node --version   # Should show v16.x or higher
python --version # Should show 3.8 or higher
git --version    # Should show git version
```

---

## 🚀 Quick Install (5 minutes)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/react-langchain-app.git
cd react-langchain-app
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy the template)
# On Windows:
copy ENV_TEMPLATE.md .env
# On macOS/Linux:
cp ENV_TEMPLATE.md .env

# Edit .env and add your API key
notepad .env  # Windows
# OR
nano .env     # macOS/Linux
```

**Add your API key to `.env`:**
```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### Step 3: Frontend Setup

Open a **new terminal** window:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# This might take 2-3 minutes
```

### Step 4: Start the Application

#### Option A: Automatic Start (Windows Only)

```bash
# From the root directory
start_with_websocket.bat
```

This will automatically:
- ✅ Start the backend server
- ✅ Start the frontend dev server
- ✅ Open your browser

#### Option B: Manual Start (All Platforms)

**Terminal 1 - Backend:**
```bash
cd backend
# Activate venv if not already activated
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Your browser should automatically open to `http://localhost:3000`

---

## ✅ Verify Installation

### 1. Check Backend Health

Visit: http://localhost:8000/api/health

You should see:
```json
{
  "status": "healthy",
  "service": "english-checker"
}
```

### 2. Check WebSocket Connection

Open the app at http://localhost:3000 and look for:
- 🟢 Green dot with "AI 助手已连接" in the feedback panel

### 3. Test the Application

1. Type: `Hello World.` (don't forget the period)
2. Press **Space** or **Enter**
3. Wait for AI feedback to appear

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error: `ModuleNotFoundError: No module named 'fastapi'`**

Solution:
```bash
# Make sure virtual environment is activated
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Reinstall dependencies
pip install -r requirements.txt
```

**Error: `ValueError: OPENAI_API_KEY is required`**

Solution:
- Check that `.env` file exists in `backend/` directory
- Verify your API key is correct
- Make sure there are no spaces or quotes around the key

### Frontend Won't Start

**Error: `npm: command not found`**

Solution:
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

**Error: Port 3000 already in use**

Solution:
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

### WebSocket Connection Fails

**Symptoms:**
- Red dot or "未连接" status
- No real-time feedback

**Solutions:**

1. **Check Backend is Running:**
   ```bash
   # Visit: http://localhost:8000/docs
   # You should see FastAPI documentation
   ```

2. **Check CORS Settings:**
   In `backend/main.py`, verify:
   ```python
   origins = [
       "http://localhost:3000",
       # ... other origins
   ]
   ```

3. **Check Firewall:**
   - Allow connections on ports 3000 and 8000
   - Temporarily disable firewall to test

4. **Check Browser Console:**
   - Press F12 in browser
   - Look for WebSocket errors
   - Common issue: Backend not running

### API Key Issues

**Error: 429 Too Many Requests**

Solution:
- You've hit OpenAI rate limits
- Wait a few minutes
- Consider upgrading your API plan

**Error: 401 Unauthorized**

Solution:
- API key is invalid or expired
- Generate a new key at https://platform.openai.com/api-keys
- Update `.env` file

---

## 🔄 Updating

To get the latest version:

```bash
# Pull latest changes
git pull origin main

# Update backend dependencies
cd backend
pip install -r requirements.txt --upgrade

# Update frontend dependencies
cd ../frontend
npm install
```

---

## 🗑️ Uninstalling

To remove the application:

```bash
# Remove the directory
rm -rf react-langchain-app

# Or on Windows:
rmdir /s react-langchain-app
```

---

## 📞 Need Help?

- 📖 Check the [README](README.md)
- 🐛 Report bugs: [GitHub Issues](https://github.com/yourusername/react-langchain-app/issues)
- 💬 Ask questions: [Discussions](https://github.com/yourusername/react-langchain-app/discussions)

---

## 🎉 You're All Set!

Congratulations! You're ready to start your English learning journey! 🌻

**Next Steps:**
1. Explore the UI and features
2. Write your first journal entry
3. Try asking the AI agent questions
4. Check out the decision tree visualization

Happy learning! ✨

