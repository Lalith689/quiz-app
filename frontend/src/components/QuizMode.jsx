import { useState } from 'react'
import './QuizMode.css'

export default function QuizMode({ questions, onComplete, onBack }) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})

  const total = questions.length
  const q = questions[current]
  const selected = answers[current] || null
  const progress = ((current + 1) / total) * 100

  const handleSelect = (letter) => {
    const updated = { ...answers, [current]: letter }
    setAnswers(updated)
  }

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1)
  }

  const handleNext = () => {
    if (current + 1 < total) setCurrent(current + 1)
    else onComplete(Object.values(answers))
  }

  const getLetter = (opt) => opt.charAt(0)

  return (
    <div className="quiz-mode fade-up">
      <div className="quiz-topbar">
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <div className="quiz-counter">
          <span className="current-num">{current + 1}</span>
          <span className="divider-slash">/</span>
          <span className="total-num">{total}</span>
        </div>
        <div className="chip chip-accent" style={{fontSize:11}}>{Math.round((current/total)*100)}% done</div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{width:`${progress}%`}} />
      </div>

      <div className="question-card card fade-up" key={current}>
        <p className="q-label">Question {current + 1}</p>
        <h2 className="question-text">{q.question}</h2>
      </div>

      <div className="options-grid">
        {q.options.map((option) => {
          const letter = getLetter(option)
          const isSelected = selected === letter
          return (
            <button
              key={letter}
              className={`option-btn ${isSelected ? 'option-selected' : ''}`}
              onClick={() => handleSelect(letter)}
            >
              <span className="option-letter">{letter}</span>
              <span className="option-text">{option.substring(3)}</span>
            </button>
          )
        })}
      </div>

      <div className="nav-area fade-up">
        <button 
          className="btn btn-secondary" 
          onClick={handlePrev}
          disabled={current === 0}
        >
          ← Previous
        </button>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {selected ? '✓ Answer selected' : 'Select an option'}
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleNext}
        >
          {current + 1 === total ? 'Finish Quiz' : 'Next →'}
        </button>
      </div>

      <div className="question-dots">
        {questions.map((_, i) => (
          <div key={i} className={`dot ${i < current ? 'dot-done' : ''} ${i === current ? 'dot-current' : ''}`} />
        ))}
      </div>
    </div>
  )
}
