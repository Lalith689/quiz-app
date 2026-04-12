# 📚 Java OOP Study Companion — Quiz Generator & Flashcards

An AI-powered study tool built for **B.Tech CSE (OOP with Java)** — upload any PDF syllabus or notes, generate quizzes or flashcards instantly using Claude AI.

---

## 🏗️ Architecture

```
quiz-app/
├── backend/     ← Java 17 + Spring Boot (PDF parsing, Anthropic API)
└── frontend/    ← React 18 + Vite (UI)
```

**Why Java for the backend?** This project is built for the OOP with Java course — the backend demonstrates:
- **Classes & Objects** (model classes: `Question`, `Flashcard`)
- **Encapsulation** (service classes with private fields + getters/setters)
- **Abstraction** (services hide implementation details from the controller)
- **Annotations** (Spring's `@Service`, `@RestController`, `@Autowired`)
- **Exception Handling** (try-catch in every service method)
- **Collections** (using `List<Question>`, `List<Flashcard>`)

---

## ⚙️ Prerequisites

| Tool | Version |
|------|---------|
| Java JDK | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| npm | 9+ |

Get your **Anthropic API key** at: https://console.anthropic.com/

---

## 🚀 Running Locally

### 1. Set your API Key

**Mac/Linux:**
```bash
export ANTHROPIC_API_KEY=sk-ant-...your-key-here...
```

**Windows (PowerShell):**
```powershell
$env:ANTHROPIC_API_KEY="sk-ant-...your-key-here..."
```

### 2. Start the Backend (Java Spring Boot)

```bash
cd quiz-app/backend
mvn spring-boot:run
```

Backend runs at → `http://localhost:8080`

### 3. Start the Frontend (React + Vite)

```bash
cd quiz-app/frontend
npm install
npm run dev
```

Frontend runs at → `http://localhost:5173`

### 4. Open in browser

Go to **http://localhost:5173** and start studying! 🎉

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/generate-quiz` | Upload PDF + config → returns quiz questions |
| `POST` | `/api/generate-flashcards` | Upload PDF → returns 10 flashcards |

Both endpoints accept `multipart/form-data`.

---

## 🌐 Deploying

### Backend (Railway / Render / Fly.io)
```bash
cd backend
mvn package
# Upload the generated target/*.jar file
# Set ANTHROPIC_API_KEY as environment variable
```

### Frontend (Vercel / Netlify)
```bash
cd frontend
# Update VITE_API_URL in .env.production to your deployed backend URL
npm run build
# Deploy the dist/ folder
```

---

## 📁 Key Java Classes

- `QuizApplication.java` — Spring Boot entry point
- `QuizController.java` — REST endpoints (`@RestController`)
- `PdfService.java` — PDF text extraction using Apache PDFBox
- `AIService.java` — Anthropic Claude API integration
- `Question.java` — Quiz question model (with options, correct answer, explanation)
- `Flashcard.java` — Flashcard model (front/back)
- `CorsConfig.java` — CORS configuration for frontend communication
