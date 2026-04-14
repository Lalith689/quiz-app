import { useState } from 'react'
import Icon from './components/Icons.jsx'
import LandingPage from './components/LandingPage.jsx'
import UploadPage from './components/UploadPage.jsx'
import QuizMode from './components/QuizMode.jsx'
import FlashcardMode from './components/FlashcardMode.jsx'
import ResultsPage from './components/ResultsPage.jsx'

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api' : 'https://quiz-app-backend-oinn.onrender.com/api')

export default function App() {
  const [page, setPage] = useState('landing')
  const [questions, setQuestions] = useState([])
  const [flashcards, setFlashcards] = useState([])
  const [userAnswers, setUserAnswers] = useState([])

  const goHome = () => {
    setPage('landing')
    setQuestions([])
    setFlashcards([])
    setUserAnswers([])
  }

  const handleQuizReady       = (qs)  => { setQuestions(qs);   setPage('quiz') }
  const handleFlashcardsReady = (fc)  => { setFlashcards(fc);  setPage('flashcards') }
  const handleQuizComplete    = (ans) => { setUserAnswers(ans); setPage('results') }

  return (
    <div className="app">
      {page !== 'landing' && (
        <header className="app-header">
          <div className="logo" onClick={goHome} title="Go to home">
            <div className="logo-icon">
              <Icon name="coffee" size={18} color="#fff" strokeWidth={1.8} />
            </div>
            <h1>Study Companion</h1>
          </div>
          <span className="header-badge">Quizs · Flashcards</span>
        </header>
      )}

      {page === 'landing' && <LandingPage onStart={() => setPage('upload')} />}

      {page !== 'landing' && (
        <main>
          {page === 'upload'     && <UploadPage apiBase={API_BASE} onQuizReady={handleQuizReady} onFlashcardsReady={handleFlashcardsReady} />}
          {page === 'quiz'       && <QuizMode questions={questions} onComplete={handleQuizComplete} onBack={() => setPage('upload')} />}
          {page === 'flashcards' && <FlashcardMode flashcards={flashcards} onBack={() => setPage('upload')} />}
          {page === 'results'    && <ResultsPage questions={questions} userAnswers={userAnswers} onReset={goHome} />}
        </main>
      )}
    </div>
  )
}
