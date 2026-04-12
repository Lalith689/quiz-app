import { useState, useRef } from 'react'
import './UploadPage.css'

export default function UploadPage({ apiBase, onQuizReady, onFlashcardsReady }) {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [mode, setMode] = useState(null)
  const [numQuestions, setNumQuestions] = useState(5)
  const [difficulty, setDifficulty] = useState('medium')
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped?.type === 'application/pdf') { setFile(dropped); setError('') }
    else setError('Please upload a PDF file.')
  }

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (f) { setFile(f); setError(''); setMode(null) }
  }

  const handleGenerateQuiz = async () => {
    if (!file) return
    setError(''); setLoading(true)
    setLoadingMsg(`Generating ${numQuestions} ${difficulty} questions…`)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('numQuestions', numQuestions)
      formData.append('difficulty', difficulty)
      const res = await fetch(`${apiBase}/generate-quiz`, { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate quiz')
      if (!data.questions?.length) throw new Error('No questions returned. Try again.')
      onQuizReady(data.questions)
    } catch (err) {
      setError(err.message || 'Something went wrong. Check that the backend is running.')
    } finally { setLoading(false); setLoadingMsg('') }
  }

  const handleGenerateFlashcards = async () => {
    if (!file) return
    setError(''); setLoading(true)
    setLoadingMsg('Generating flashcards…')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`${apiBase}/generate-flashcards`, { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate flashcards')
      if (!data.flashcards?.length) throw new Error('No flashcards returned. Try again.')
      onFlashcardsReady(data.flashcards)
    } catch (err) {
      setError(err.message || 'Something went wrong. Check that the backend is running.')
    } finally { setLoading(false); setLoadingMsg('') }
  }

  const fmt = (b) => b < 1024*1024 ? (b/1024).toFixed(1)+' KB' : (b/(1024*1024)).toFixed(1)+' MB'

  return (
    <div className="upload-page fade-up">
      <div className="page-intro">
        <p className="page-eyebrow">// study tool</p>
        <h2 className="page-title">Upload your PDF</h2>
        <p className="page-subtitle">Drop in any lecture notes, syllabus, or textbook chapter and generate study material instantly.</p>
      </div>

      {/* Drop zone */}
      <div
        className={`drop-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileChange} style={{display:'none'}} />
        {file ? (
          <div className="file-info">
            <div className="file-icon">📄</div>
            <div className="file-details">
              <div className="file-name">{file.name}</div>
              <div className="file-meta">{fmt(file.size)} · PDF</div>
            </div>
            <button className="btn btn-ghost file-remove" onClick={(e) => { e.stopPropagation(); setFile(null); setMode(null) }}>✕ Remove</button>
          </div>
        ) : (
          <div className="drop-prompt">
            <div className="drop-icon">⬆</div>
            <div className="drop-text">
              <strong>Drop your PDF here</strong>
              <span>or click to browse</span>
            </div>
            <div className="drop-hint">PDF files up to 20MB</div>
          </div>
        )}
      </div>

      {error && <div className="error-msg"><span>⚠</span><span>{error}</span></div>}

      {/* Mode selection */}
      {file && !loading && (
        <div className="mode-section fade-up">
          <p className="section-label">Choose mode</p>
          <div className="mode-cards">
            {[
              { id: 'quiz',      icon: '🧠', name: 'Quiz Generator',  desc: 'MCQs with detailed answer explanations' },
              { id: 'flashcard', icon: '🃏', name: 'Flashcards',       desc: '10 concise flip cards to memorize key concepts' },
            ].map(m => (
              <div key={m.id} className={`mode-card ${mode === m.id ? 'selected' : ''}`} onClick={() => setMode(mode === m.id ? null : m.id)}>
                <div className="mode-icon">{m.icon}</div>
                <div className="mode-info">
                  <div className="mode-name">{m.name}</div>
                  <div className="mode-desc">{m.desc}</div>
                </div>
                <div className="mode-check">✓</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz config */}
      {mode === 'quiz' && !loading && (
        <div className="quiz-config card fade-up">
          <p className="section-label">Quiz settings</p>
          <div className="config-grid">
            <div>
              <label className="config-label">Number of questions</label>
              <div className="num-options">
                {[5,10,15].map(n => (
                  <button key={n} className={`num-btn ${numQuestions===n?'active':''}`} onClick={() => setNumQuestions(n)}>{n}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="config-label">Difficulty</label>
              <div className="difficulty-options">
                {[
                  { value:'easy',   label:'Easy',   icon:'🟢', desc:'Definitions & basics' },
                  { value:'medium', label:'Medium', icon:'🟡', desc:'Application & analysis' },
                  { value:'hard',   label:'Hard',   icon:'🔴', desc:'Edge cases & code' },
                ].map(d => (
                  <button key={d.value} className={`diff-btn ${difficulty===d.value?'active':''}`} onClick={() => setDifficulty(d.value)}>
                    <span className="diff-icon">{d.icon}</span>
                    <span className="diff-label">{d.label}</span>
                    <span className="diff-desc">{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="config-summary">Generating <strong>{numQuestions} {difficulty}</strong> questions from <strong>{file.name}</strong></div>
          <button className="btn btn-primary btn-large" onClick={handleGenerateQuiz}>Generate Quiz →</button>
        </div>
      )}

      {/* Flashcard CTA */}
      {mode === 'flashcard' && !loading && (
        <div className="flashcard-cta card fade-up">
          <p className="section-label">Flashcard settings</p>
          <div className="fc-count">
            <span className="fc-num-big">10</span>
            <span className="fc-num-label">cards · flip to reveal · covers all topics</span>
          </div>
          <div className="config-summary">Generating 10 flashcards from <strong>{file.name}</strong></div>
          <button className="btn btn-primary btn-large" onClick={handleGenerateFlashcards}>Generate Flashcards →</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading-box card fade-up">
          <div className="spinner" style={{width:26,height:26}} />
          <div>
            <div className="loading-main">{loadingMsg}</div>
            <div className="loading-sub">Usually takes 10–20 seconds</div>
          </div>
        </div>
      )}

      {/* Feature hints */}
      {!file && (
        <div className="features-grid">
          {[
            { icon:'🎯', title:'5, 10 or 15 questions', desc:'Pick your session length' },
            { icon:'📊', title:'3 difficulty levels',   desc:'Easy → Medium → Hard' },
            { icon:'💡', title:'Detailed explanations', desc:'Understand why each answer is correct' },
            { icon:'🃏', title:'10 flip cards',          desc:'Core concepts to memorize' },
          ].map(f => (
            <div key={f.title} className="feature-box">
              <span className="feature-box-icon">{f.icon}</span>
              <div>
                <div className="feature-box-title">{f.title}</div>
                <div className="feature-box-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
