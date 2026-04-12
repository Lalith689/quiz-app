import './ResultsPage.css'

export default function ResultsPage({ questions, userAnswers, onReset }) {
  const total = questions.length
  const correct = questions.filter((q, i) => userAnswers[i] === q.correctAnswer).length
  const pct = Math.round((correct / total) * 100)

  const getGrade = () => {
    if (pct >= 90) return { label: 'Excellent!',      icon: '🏆', color: 'var(--success)' }
    if (pct >= 70) return { label: 'Good Job!',       icon: '🎯', color: 'var(--warm)' }
    if (pct >= 50) return { label: 'Keep Practicing', icon: '📖', color: 'var(--neutral)' }
    return              { label: 'Needs Revision',   icon: '💪', color: 'var(--error)' }
  }

  const grade = getGrade()
  const getLetter = (opt) => opt.charAt(0)

  return (
    <div className="results-page fade-up">

      <div className="score-card card">
        <div className="score-header">
          <span className="score-eyebrow">Quiz Results</span>
          <div className="score-grade" style={{color: grade.color}}>
            <span>{grade.icon}</span>
            <span>{grade.label}</span>
          </div>
        </div>
        <div className="score-body">
          <span className="score-correct">{correct}</span>
          <span className="score-sep">/</span>
          <span className="score-total">{total}</span>
          <span className="score-pct">{pct}% correct</span>
        </div>
        <div>
          <div className="progress-bar" style={{height:4}}>
            <div className="progress-fill" style={{width:`${pct}%`, background: grade.color}} />
          </div>
          <div className="score-stats">
            <span style={{color:'var(--success)'}}>✓ {correct} correct</span>
            <span style={{color:'var(--error)'}}>✗ {total - correct} wrong</span>
          </div>
        </div>
      </div>

      <div className="breakdown">
        <p className="breakdown-label">Question breakdown</p>
        {questions.map((q, i) => {
          const userAnswer = userAnswers[i]
          const isCorrect = userAnswer === q.correctAnswer
          return (
            <div key={i} className={`result-item card ${isCorrect ? 'result-correct' : 'result-wrong'}`}>
              <div className="result-header">
                <span className="result-num">Q{i + 1}</span>
                <span className={`result-badge ${isCorrect ? 'badge-correct' : 'badge-wrong'}`}>
                  {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
              <p className="result-question">{q.question}</p>
              <div className="result-options">
                {q.options.map((option) => {
                  const letter = getLetter(option)
                  const isUserAns  = letter === userAnswer
                  const isRight    = letter === q.correctAnswer
                  let cls = 'result-option'
                  if (isRight) cls += ' option-right'
                  else if (isUserAns && !isCorrect) cls += ' option-user-wrong'
                  return (
                    <div key={letter} className={cls}>
                      <span className="result-option-letter">{letter}</span>
                      <span className="result-option-text">{option.substring(3)}</span>
                      <span className="result-option-tag">
                        {isRight    && <span className="tag-correct">{isUserAns ? 'Your answer ✓' : '✓ Correct'}</span>}
                        {isUserAns && !isRight && <span className="tag-wrong">Your answer</span>}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="result-explanation">
                <div className="explanation-label">💡 Explanation</div>
                <p className="explanation-text">{q.explanation}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="results-actions">
        <button className="btn btn-primary btn-large" onClick={onReset}>← Try Another PDF</button>
        <button className="btn btn-secondary" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>↑ Back to top</button>
      </div>
    </div>
  )
}
