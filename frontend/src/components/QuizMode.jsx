import { useState } from 'react'
import './QuizMode.css'

export default function QuizMode({ questions, onComplete, onBack }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])

  const total = questions.length
  const q = questions[current]
  const progress = (current / total) * 100

  const handleSelect = (letter) => { if (selected === null) setSelected(letter) }

  const handleNext = () => {
    const recorded = [...answers, selected]
    setAnswers(recorded)
    if (current + 1 < total) { setCurrent(current + 1); setSelected(null) }
    else onComplete(recorded)
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
              className={`option-btn ${isSelected ? 'option-selected' : ''} ${selected && !isSelected ? 'option-dim' : ''}`}
              onClick={() => handleSelect(letter)}
              disabled={selected !== null}
            >
              <span className="option-letter">{letter}</span>
              <span className="option-text">{option.substring(3)}</span>
            </button>
          )
        })}
      </div>

      {selected !== null && (
        <div className="next-area fade-up">
          <div className="answer-recorded">
            <span>✓</span>
            <span>Answer recorded — results shown at the end</span>
          </div>
          <button className="btn btn-primary" onClick={handleNext}>
            {current + 1 === total ? 'Finish Quiz' : 'Next →'}
          </button>
        </div>
      )}

      <div className="question-dots">
        {questions.map((_, i) => (
          <div key={i} className={`dot ${i < current ? 'dot-done' : ''} ${i === current ? 'dot-current' : ''}`} />
        ))}
      </div>
    </div>
  )
}
