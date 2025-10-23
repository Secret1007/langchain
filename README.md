# 🌻 English Journey - AI-Powered English Learning Platform

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-66.5%25-blue?logo=typescript)
![Python](https://img.shields.io/badge/Python-27.5%25-yellow?logo=python)
![React](https://img.shields.io/badge/React-19.1-61dafb?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?logo=fastapi)
![License](https://img.shields.io/badge/license-MIT-green)

**A modern, real-time English writing assistant powered by AI**

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About

**English Journey** is an intelligent English learning platform that combines the power of **LangChain**, **OpenAI GPT**, and **WebSocket** technology to provide real-time grammar checking, writing assistance, and personalized feedback. Perfect for English learners, ESL students, and anyone looking to improve their writing skills.

### 🎯 Key Highlights

- 🤖 **Real-time AI Feedback** - Instant grammar and style suggestions as you write
- 📝 **Smart Sentence Detection** - Only checks when you complete a sentence
- 💬 **WebSocket Integration** - Live, bidirectional communication
- 🌐 **RAG-Powered Knowledge** - Physics domain-specific Q&A with vector search
- 📊 **Visual Decision Trees** - See how the AI agent makes decisions
- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS
- 💾 **Local Storage** - Save and manage your journal entries

---

## ✨ Features

### 🖊️ Writing Assistant

- **Real-time Grammar Checking**: AI analyzes your sentences as you write
- **Smart Triggers**: Only activates after punctuation marks (`.`, `!`, `?`)
- **Contextual Suggestions**: Get improvement suggestions with explanations
- **Scoring System**: Receive quality scores (Excellent / Good / Fair / Needs Improvement)
- **Inline Corrections**: Apply suggestions with a single click

### 🧠 AI Agent System

- **LangChain Integration**: Conversational AI with memory
- **Tool Selection**: Automatically chooses the right tool for your query
- **Decision Visualization**: Interactive decision tree showing the agent's reasoning
- **Multi-tool Support**: 
  - Weather queries
  - Physics knowledge base (LHC, BESIII, LHAASO)
  - Custom tool integration

### 📔 Journal Management

- **Category Organization**: Organize entries by topics (Toastmasters, etc.)
- **Search Functionality**: Find entries by title, content, or category
- **Rich Media Support**: Attach images to your entries
- **Export/Import**: Save and load your journal data

### 🔌 Real-time Features

- **WebSocket Connection**: Persistent connection for instant feedback
- **Auto-reconnection**: Automatic retry with exponential backoff
- **Connection Status**: Visual indicator of connection health
- **Heartbeat Mechanism**: Keeps connection alive

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Radix UI** - Component primitives
- **WebSocket API** - Real-time communication

### Backend
- **FastAPI** - Modern Python web framework
- **LangChain** - AI agent orchestration
- **OpenAI API** - GPT models for language processing
- **FAISS** - Vector similarity search
- **Sentence Transformers** - Text embeddings
- **WebSockets** - Real-time bidirectional communication

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 16.x
- **Python** >= 3.8
- **OpenAI API Key** (or DeepSeek API)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/react-langchain-app.git
cd react-langchain-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
# OR
cp .env.example .env    # macOS/Linux

# Add your API key to .env
# OPENAI_API_KEY=your-api-key-here
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 4. Start the Application

#### Option 1: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

#### Option 2: Quick Start (Windows)

```bash
# Start with WebSocket support
start_with_websocket.bat

# OR standard start
start.bat
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 📁 Project Structure

```
react-langchain-app/
├── backend/                    # FastAPI backend
│   ├── services/              # Business logic
│   │   ├── english_checker.py # AI grammar checker
│   │   ├── rag_builder.py     # RAG implementation
│   │   └── tools.py           # LangChain tools
│   ├── docs/                  # Document storage
│   ├── vectorstore/           # FAISS indices
│   ├── main.py               # FastAPI app & WebSocket
│   └── requirements.txt       # Python dependencies
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── EnglishJournal.tsx    # Main journal UI
│   │   │   ├── RealtimeFeedback.tsx  # WebSocket feedback
│   │   │   ├── Editor.tsx            # Text editor
│   │   │   ├── RevisionPanel.tsx     # Suggestions panel
│   │   │   └── DecisionTree.tsx      # Agent visualization
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useWebSocket.ts       # WebSocket hook
│   │   │   ├── useEnglishAnalyzer.tsx
│   │   │   └── useLocalStorage.ts
│   │   ├── utils/             # Helper functions
│   │   ├── api.ts             # API client
│   │   └── App.tsx            # Main app component
│   └── package.json           # Node dependencies
│
├── CHANGELOG.md               # Version history
├── WEBSOCKET_GUIDE.md         # WebSocket documentation
├── OPTIMIZATION_LOG.md        # Performance notes
└── README.md                  # This file
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

# Alternative: DeepSeek Configuration
# DEEPSEEK_API_KEY=your-deepseek-api-key
# DEEPSEEK_API_BASE=https://api.deepseek.com/v1

# Application Settings
CORS_ORIGINS=http://localhost:3000
DEBUG=True
```

### Frontend Configuration

Update `frontend/src/api.ts` for custom backend URL:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

---

## 📚 Documentation

### API Endpoints

#### Chat & Agent
- `POST /ask` - Send a query to the AI agent
  - Request: `{ "question": "What's the weather in Beijing?" }`
  - Response: Agent response with decision log

#### English Checking
- `POST /api/check-word` - Check word spelling
- `POST /api/check-sentence` - Check sentence grammar
- `POST /api/improve-text` - Get improvement suggestions
- `GET /api/health` - Health check

#### WebSocket
- `WS /ws/writing-assistant/{client_id}` - Real-time writing assistance
  - Events: `start_session`, `text_update`, `request_improvement`
  - Responses: `feedback`, `analyzing`, `error`

### WebSocket Message Format

**Client → Server:**
```json
{
  "type": "text_update",
  "text": "This is my first sentence."
}
```

**Server → Client:**
```json
{
  "type": "feedback",
  "sentence": "This is my first sentence.",
  "is_complete": true,
  "issues": [],
  "suggestions": [],
  "score": 0.95,
  "explanation": "Excellent sentence!"
}
```

---

## 🎮 Usage

### 1. Writing with Real-time Feedback

1. Navigate to the **Home** tab
2. Start typing in the editor
3. Complete a sentence with `.`, `!`, or `?`
4. Add a **space** or **press Enter**, or wait **3 seconds**
5. AI will automatically analyze and provide feedback

### 2. Using the AI Agent

1. Go to the **Gallery** tab
2. Type a question in the chat input
3. View the decision tree to see how the agent reasons
4. The agent will use tools when needed (weather, physics Q&A)

### 3. Managing Journal Entries

1. Write your diary entry in the editor
2. Choose a category (Toastmasters, Others)
3. Click **Add Diary Entry** to save
4. Switch to **Entries** tab to view, edit, or delete entries

---

## 🎨 Screenshots

### Real-time Writing Assistant
```
┌─────────────────────────────────────────────────────────┐
│  📝 Editor      │  🤖 AI Feedback  │  🔧 Revision Panel │
│                 │                  │                     │
│  Type here...   │  ✓ Connected     │  Inline Suggestions │
│                 │  Score: 90%      │  One-click Revise   │
│                 │  Great work!     │  Original Text      │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Development

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests (if available)
cd backend
pytest
```

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# The build folder will contain optimized static files
```

### Code Style

- **Frontend**: ESLint + Prettier
- **Backend**: PEP 8 (Python style guide)

---

## 🐛 Troubleshooting

### WebSocket Connection Fails
- Check that the backend is running on port 8000
- Verify CORS settings in `backend/main.py`
- Look for firewall/proxy blocking WebSocket connections

### API Key Errors
- Ensure `.env` file is in the `backend/` directory
- Verify your OpenAI API key is valid and has credits
- Check API base URL is correct

### Import Errors
- Make sure all dependencies are installed
- Activate virtual environment for Python
- Run `npm install` again if needed

---

## 🗺️ Roadmap

- [ ] Multi-language support (Spanish, French, Chinese)
- [ ] Voice input and pronunciation feedback
- [ ] Collaborative writing features
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Custom AI model fine-tuning
- [ ] Browser extension

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code of Conduct

Please be respectful and constructive in all interactions.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👏 Acknowledgments

- **LangChain** - For the amazing AI agent framework
- **OpenAI** - For GPT models
- **FastAPI** - For the excellent Python web framework
- **React Team** - For React 19
- **Tailwind CSS** - For the utility-first CSS framework
- **Radix UI** - For accessible component primitives

---

## 📧 Contact

**Project Maintainer**: Secret 🌻

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

**Project Link**: [https://github.com/yourusername/react-langchain-app](https://github.com/yourusername/react-langchain-app)

---

<div align="center">

**Made with ❤️ and ☕ by Secret**

⭐ Star this repo if you find it helpful!

</div>

