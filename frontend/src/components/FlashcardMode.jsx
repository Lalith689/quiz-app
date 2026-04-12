import { useState } from 'react'
import './FlashcardMode.css'

export default function FlashcardMode({ flashcards, onBack }) {
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [seen, setSeen] = useState(new Set())

  const total = flashcards.length
  const card = flashcards[current]

  const handleFlip = () => {
    setFlipped(!flipped)
    if (!flipped) setSeen(prev => new Set([...prev, current]))
  }

  const handlePrev = () => { if (current > 0) { setCurrent(current - 1); setFlipped(false) } }
  const handleNext = () => { if (current < total - 1) { setCurrent(current + 1); setFlipped(false) } }
  const handleJump = (i) => { setCurrent(i); setFlipped(false) }

  return (
    <div className="flashcard-mode fade-up">
      <div className="fc-topbar">
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <div className="fc-progress-info">
          <span className="fc-counter">{current + 1} / {total}</span>
          <span className="fc-seen">{seen.size} seen</span>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{width:`${((current+1)/total)*100}%`}} />
      </div>

      <div className="fc-card-wrap" onClick={handleFlip}>
        <div className={`fc-card ${flipped ? 'flipped' : ''}`}>
          <div className="fc-face fc-front">
            <div className="fc-face-label">
              <span>Concept</span>
              <span className="fc-flip-hint">click to reveal →</span>
            </div>
            <div className="fc-front-text">{card.front}</div>
            <div className="fc-card-num">
              <span className="fc-num-big">{current + 1}</span>
              <span className="fc-num-sep">/</span>
              <span className="fc-num-total">{total}</span>
            </div>
          </div>
          <div className="fc-face fc-back">
            <div className="fc-face-label">
              <span>Explanation</span>
              <span className="fc-flip-hint">← click to flip back</span>
            </div>
            <div className="fc-back-text">{card.back}</div>
            <div className="fc-seen-mark">✓ Seen</div>
          </div>
        </div>
      </div>

      <p className="fc-tap-hint">Click the card to flip</p>

      <div className="fc-nav">
        <button className="btn btn-secondary" onClick={handlePrev} disabled={current === 0}>← Prev</button>
        <div className="fc-dots">
          {flashcards.map((_, i) => (
            <button
              key={i}
              className={`fc-dot ${i === current ? 'fc-dot-current' : ''} ${seen.has(i) ? 'fc-dot-seen' : ''}`}
              onClick={() => handleJump(i)}
            />
          ))}
        </div>
        <button className="btn btn-secondary" onClick={handleNext} disabled={current === total - 1}>Next →</button>
      </div>

      {seen.size === total && (
        <div className="fc-complete card fade-up">
          <div className="fc-complete-icon">🎉</div>
          <div className="fc-complete-text">
            <strong>All cards reviewed!</strong>
            <span>You've gone through all {total} flashcards.</span>
          </div>
          <button className="btn btn-primary" onClick={onBack}>Done</button>
        </div>
      )}

      <div className="fc-overview">
        <p className="fc-overview-label">All cards</p>
        <div className="fc-list">
          {flashcards.map((fc, i) => (
            <div
              key={i}
              className={`fc-list-item ${i === current ? 'fc-list-current' : ''} ${seen.has(i) ? 'fc-list-seen' : ''}`}
              onClick={() => handleJump(i)}
            >
              <div className="fc-list-num">{i + 1}</div>
              <div className="fc-list-front">{fc.front}</div>
              {seen.has(i) && <span className="fc-list-check">✓</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
