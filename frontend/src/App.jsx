import { useState } from 'react'
import UploadPage from './components/UploadPage.jsx'
import QuizMode from './components/QuizMode.jsx'
import FlashcardMode from './components/FlashcardMode.jsx'
import ResultsPage from './components/ResultsPage.jsx'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export default function App() {
  const [page, setPage] = useState('upload')
  const [questions, setQuestions] = useState([])
  const [flashcards, setFlashcards] = useState([])
  const [userAnswers, setUserAnswers] = useState([])

  const handleQuizReady = (qs) => {
    setQuestions(qs)
    setPage('quiz')
  }

  const handleFlashcardsReady = (fc) => {
    setFlashcards(fc)
    setPage('flashcards')
  }

  const handleQuizComplete = (answers) => {
    setUserAnswers(answers)
    setPage('results')
  }

  const handleReset = () => {
    setPage('upload')
    setQuestions([])
    setFlashcards([])
    setUserAnswers([])
  }

  return (
    <div className="app">
      <header className="app-header">
        <button className="logo" onClick={handleReset} style={{background:'none',border:'none',cursor:'pointer'}}>
          <div className="logo-icon">☕</div>
          <h1>Study Companion</h1>
        </button>
        <span className="badge">Quiz · Flashcards</span>
      </header>

      <main>
        {page === 'upload' && (
          <UploadPage
            apiBase={API_BASE}
            onQuizReady={handleQuizReady}
            onFlashcardsReady={handleFlashcardsReady}
          />
        )}
        {page === 'quiz' && (
          <QuizMode
            questions={questions}
            onComplete={handleQuizComplete}
            onBack={handleReset}
          />
        )}
        {page === 'flashcards' && (
          <FlashcardMode
            flashcards={flashcards}
            onBack={handleReset}
          />
        )}
        {page === 'results' && (
          <ResultsPage
            questions={questions}
            userAnswers={userAnswers}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  )
}
