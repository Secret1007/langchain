# 🏗️ Architecture Overview

This document explains the technical architecture of English Journey.

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   React UI   │  │   WebSocket  │  │  HTTP Client │     │
│  │  Components  │◄─┤    Client    │  │   (Axios)    │     │
│  └──────────────┘  └──────┬───────┘  └──────┬───────┘     │
│                            │                  │              │
│                    ┌───────▼──────────────────▼───────┐    │
│                    │      API Layer (api.ts)           │    │
│                    └───────────────────────────────────┘    │
└────────────────────────────┼───────────────────────────────┘
                              │
                 ┌────────────┼────────────┐
                 │            │            │
        ┌────────▼────┐   ┌──▼─────────┐  │
        │  WebSocket  │   │    HTTP    │  │
        │  Connection │   │   REST API │  │
        └────────┬────┘   └──┬─────────┘  │
                 │           │            │
┌────────────────┼───────────┼────────────┼─────────────────┐
│                │           │            │      Backend     │
│         ┌──────▼───────────▼────────────▼───────┐         │
│         │       FastAPI Application              │         │
│         │  ┌──────────────────────────────────┐ │         │
│         │  │  WebSocket Manager               │ │         │
│         │  │  - Connection pooling            │ │         │
│         │  │  - Session management            │ │         │
│         │  │  - Real-time communication       │ │         │
│         │  └──────────────────────────────────┘ │         │
│         │  ┌──────────────────────────────────┐ │         │
│         │  │  API Endpoints                   │ │         │
│         │  │  - /ask (AI Agent)               │ │         │
│         │  │  - /api/check-sentence           │ │         │
│         │  │  - /api/improve-text             │ │         │
│         │  └──────────────────────────────────┘ │         │
│         └───────────────┬──────────────────────┘         │
│                         │                                  │
│         ┌───────────────┴──────────────────┐             │
│         │                                   │             │
│    ┌────▼────────┐                  ┌──────▼───────┐    │
│    │  LangChain  │                  │   English    │    │
│    │   Agent     │                  │   Checker    │    │
│    │  ┌────────┐ │                  │  (OpenAI)    │    │
│    │  │ Memory │ │                  └──────────────┘    │
│    │  └────────┘ │                                       │
│    │  ┌────────┐ │                                       │
│    │  │ Tools  │ │                                       │
│    │  └────────┘ │                                       │
│    └─────┬───────┘                                       │
│          │                                                │
│    ┌─────▼─────────────────────────┐                    │
│    │  Tool Implementations          │                    │
│    │  ┌─────────────────────────┐  │                    │
│    │  │ Weather API             │  │                    │
│    │  └─────────────────────────┘  │                    │
│    │  ┌─────────────────────────┐  │                    │
│    │  │ RAG System              │  │                    │
│    │  │  - Vector Store (FAISS) │  │                    │
│    │  │  - Embeddings           │  │                    │
│    │  │  - Semantic Search      │  │                    │
│    │  └─────────────────────────┘  │                    │
│    └────────────────────────────────┘                    │
└───────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### 1. Real-time Writing Assistance (WebSocket)

```
User Types in Editor
       │
       ▼
Detect Sentence Completion (Frontend)
       │
       ▼
Wait for Trigger (space/enter/3s delay)
       │
       ▼
Send via WebSocket: { type: "text_update", text: "..." }
       │
       ▼
Backend: ConnectionManager receives message
       │
       ▼
Backend: detect_sentence_end() extracts last sentence
       │
       ▼
Backend: english_checker.check_sentence()
       │
       ▼
OpenAI API: Analyze grammar, structure, spelling
       │
       ▼
Backend: Send feedback via WebSocket
       │
       ▼
Frontend: Display in RealtimeFeedback component
       │
       ▼
User sees instant feedback with score and suggestions
```

### 2. AI Agent Query (HTTP)

```
User asks: "What's the weather in Beijing?"
       │
       ▼
POST /ask with question
       │
       ▼
LangChain Agent receives query
       │
       ▼
Agent analyzes: Does this need a tool?
       │
       ├─ Yes: Call Weather Tool
       │       │
       │       ▼
       │   Fetch weather data
       │       │
       │       ▼
       │   Return to Agent
       │
       └─ No: Use LLM directly
       │
       ▼
Agent generates response
       │
       ▼
Return with decision log
       │
       ▼
Frontend displays in DecisionTree
```

### 3. RAG (Retrieval-Augmented Generation)

```
User asks: "What is LHC?"
       │
       ▼
Agent identifies physics-related query
       │
       ▼
Call PhysicsQA Tool
       │
       ▼
Query Vector Store (FAISS)
       │
       ├─ Convert query to embedding
       │
       ├─ Similarity search in index
       │
       └─ Retrieve top-k relevant documents
       │
       ▼
Inject context into LLM prompt
       │
       ▼
LLM generates answer with context
       │
       ▼
Return grounded response to user
```

---

## 🧩 Component Details

### Frontend Components

#### 1. **EnglishJournal.tsx** (Main Container)
- **Purpose**: Orchestrates the entire writing experience
- **Key Features**:
  - Manages editor state (title, content, category)
  - Handles WebSocket connection
  - Coordinates between Editor, RealtimeFeedback, and RevisionPanel
  - Implements smart sentence detection with debouncing

#### 2. **RealtimeFeedback.tsx**
- **Purpose**: Displays live AI feedback
- **Key Features**:
  - Connection status indicator
  - Score visualization
  - Issue highlighting
  - Suggestion display

#### 3. **Editor.tsx**
- **Purpose**: Text input with syntax highlighting
- **Key Features**:
  - Real-time issue highlighting
  - Category selection
  - Media upload
  - Character/word count

#### 4. **RevisionPanel.tsx**
- **Purpose**: Shows inline suggestions and revisions
- **Key Features**:
  - Tabbed interface (Suggestions / Revised / Original)
  - One-click apply suggestions
  - AI revision with explanation

#### 5. **DecisionTree.tsx**
- **Purpose**: Visualizes AI agent reasoning
- **Key Features**:
  - Tree structure of decisions
  - Tool usage display
  - Step-by-step reasoning

### Frontend Hooks

#### 1. **useWebSocket.ts**
- **Purpose**: Manages WebSocket lifecycle
- **Features**:
  - Auto-connect on mount
  - Reconnection with exponential backoff
  - Heartbeat mechanism (30s intervals)
  - Message queue management
  - Type-safe message handling

#### 2. **useEnglishAnalyzer.tsx**
- **Purpose**: Local grammar checking
- **Features**:
  - Pseudo-analysis for instant feedback
  - Debounced checking (2s)
  - Issue tracking
  - Only checks complete sentences

#### 3. **useLocalStorage.ts**
- **Purpose**: Persistent journal storage
- **Features**:
  - CRUD operations for entries
  - JSON serialization
  - Sync across tabs

### Backend Services

#### 1. **english_checker.py** (AI Grammar Service)
- **Purpose**: Grammar and style checking
- **Key Methods**:
  - `check_word()`: Spelling verification
  - `check_sentence()`: Full sentence analysis
  - `get_improvement_suggestions()`: Advanced suggestions
- **LLM**: OpenAI GPT-4o-mini
- **Temperature**: 0.1 (precise, consistent)

#### 2. **rag_builder.py** (Vector Search)
- **Purpose**: Domain-specific knowledge retrieval
- **Components**:
  - FAISS vector store
  - Sentence Transformers for embeddings
  - Document chunking and indexing
- **Use Case**: Physics terminology lookup

#### 3. **tools.py** (LangChain Tools)
- **Purpose**: External integrations
- **Tools**:
  - Weather API
  - Vector store queries
  - Extensible for new tools

---

## 🔐 Security Considerations

### API Keys
- ✅ Stored in `.env` (not in version control)
- ✅ Loaded via `python-dotenv`
- ✅ Server-side only (never exposed to frontend)

### CORS
- ✅ Whitelist specific origins
- ✅ Credentials allowed for same-origin requests
- ✅ Configurable via environment

### WebSocket Security
- ⚠️ Currently no authentication (suitable for local dev)
- 🔒 Production TODO: Add JWT-based auth
- 🔒 Production TODO: Rate limiting

### Input Validation
- ✅ Pydantic models for request validation
- ✅ Type checking on both frontend and backend
- ⚠️ Add content length limits for production

---

## ⚡ Performance Optimizations

### Frontend

1. **Debouncing**
   - Sentence detection: 3s delay
   - Local analysis: 2s delay
   - Prevents excessive API calls

2. **Memoization**
   - `useMemo` for expensive computations
   - React.memo for component optimization

3. **Lazy Loading**
   - Code splitting for routes
   - Dynamic imports for heavy components

### Backend

1. **Async/Await**
   - All I/O operations are async
   - Non-blocking request handling

2. **Connection Pooling**
   - WebSocket connection manager
   - Efficient resource usage

3. **Vector Store Indexing**
   - Pre-computed embeddings
   - Fast similarity search with FAISS

---

## 📈 Scalability Considerations

### Current Limitations (Local Dev)
- Single-instance backend
- In-memory WebSocket connections
- Local file storage

### Production Recommendations

1. **Backend**
   - Deploy with multiple workers (Gunicorn + Uvicorn)
   - Use Redis for session storage
   - Implement connection pooling

2. **Database**
   - Replace LocalStorage with PostgreSQL
   - Vector store on persistent volume
   - Backup strategy

3. **WebSocket**
   - Use Redis pub/sub for multi-instance WS
   - Load balancer with sticky sessions
   - Implement message queue (RabbitMQ/Kafka)

4. **Caching**
   - Redis for API responses
   - CDN for static assets
   - Vector store caching

5. **Monitoring**
   - Prometheus metrics
   - Error tracking (Sentry)
   - Log aggregation (ELK stack)

---

## 🧪 Testing Strategy

### Frontend
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Test WebSocket flows
- **E2E Tests**: Cypress for critical paths

### Backend
- **Unit Tests**: pytest for services
- **Integration Tests**: Test API endpoints
- **Load Tests**: Locust for WebSocket performance

---

## 📦 Deployment

### Docker (Recommended)

```dockerfile
# Future: Docker Compose setup
services:
  - backend (FastAPI)
  - frontend (Nginx serving React build)
  - redis (Session storage)
```

### Cloud Platforms
- **Vercel**: Frontend (React)
- **Railway/Render**: Backend (FastAPI)
- **AWS/GCP**: Full-stack with scalability

---

## 🔮 Future Enhancements

### Architecture Improvements
1. **Microservices**
   - Separate grammar service
   - Dedicated RAG service
   - Independent scaling

2. **Event-Driven**
   - Message queue for async processing
   - Event sourcing for audit logs

3. **GraphQL**
   - Replace REST with GraphQL
   - Better frontend data fetching

4. **Real-time Collaboration**
   - Operational Transform (OT)
   - Multiple users editing same document

---

## 📚 References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [LangChain Documentation](https://python.langchain.com/)
- [React Documentation](https://react.dev/)
- [WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455)
- [FAISS Documentation](https://faiss.ai/)

---

## 💡 Design Decisions

### Why WebSocket over HTTP?
- **Pros**: Real-time bidirectional communication, lower latency
- **Cons**: More complex to scale
- **Decision**: Better UX for writing assistance outweighs complexity

### Why LangChain?
- **Pros**: Easy agent orchestration, built-in memory, tool abstraction
- **Cons**: Learning curve, abstraction overhead
- **Decision**: Rapid development and extensibility

### Why FAISS over other Vector DBs?
- **Pros**: Fast, lightweight, no external dependencies
- **Cons**: Not distributed, in-memory limitations
- **Decision**: Sufficient for local dev and small datasets

---

For more details, see the [README](README.md) and [WEBSOCKET_GUIDE](WEBSOCKET_GUIDE.md).

