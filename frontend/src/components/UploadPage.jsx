import { useState, useRef } from 'react'
import Icon from './Icons.jsx'
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
      const fd = new FormData()
      fd.append('file', file); fd.append('numQuestions', numQuestions); fd.append('difficulty', difficulty)
      const res = await fetch(`${apiBase}/generate-quiz`, { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate quiz')
      if (!data.questions?.length) throw new Error('No questions returned. Try again.')
      onQuizReady(data.questions)
    } catch (err) {
      setError(err.message || 'Something went wrong. Is the backend running?')
    } finally { setLoading(false); setLoadingMsg('') }
  }

  const handleGenerateFlashcards = async () => {
    if (!file) return
    setError(''); setLoading(true); setLoadingMsg('Generating flashcards…')
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch(`${apiBase}/generate-flashcards`, { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate flashcards')
      if (!data.flashcards?.length) throw new Error('No flashcards returned. Try again.')
      onFlashcardsReady(data.flashcards)
    } catch (err) {
      setError(err.message || 'Something went wrong. Is the backend running?')
    } finally { setLoading(false); setLoadingMsg('') }
  }

  const fmt = (b) => b < 1024*1024 ? (b/1024).toFixed(1)+' KB' : (b/(1024*1024)).toFixed(1)+' MB'

  const DIFFICULTIES = [
    { value:'easy',   label:'Easy',   dot:'#3D6B4F', desc:'Definitions & basics' },
    { value:'medium', label:'Medium', dot:'#B86B2F', desc:'Application & analysis' },
    { value:'hard',   label:'Hard',   dot:'#C0392B', desc:'Edge cases & code' },
  ]

  const FEATURES = [
    { icon:'target',    title:'5, 10 or 15 questions', desc:'Pick your session length' },
    { icon:'layers',    title:'3 difficulty levels',   desc:'Easy → Medium → Hard' },
    { icon:'lightbulb', title:'Detailed explanations', desc:'Understand every answer' },
    { icon:'cards',     title:'10 flip cards',          desc:'Core concepts to memorize' },
  ]

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
            <div className="file-icon-wrap">
              <Icon name="file" size={22} color="var(--warm)" strokeWidth={1.5} />
            </div>
            <div className="file-details">
              <div className="file-name">{file.name}</div>
              <div className="file-meta">{fmt(file.size)} · PDF</div>
            </div>
            <button className="btn btn-ghost file-remove" onClick={(e) => { e.stopPropagation(); setFile(null); setMode(null) }}>
              <Icon name="close" size={14} color="var(--error)" strokeWidth={2} /> Remove
            </button>
          </div>
        ) : (
          <div className="drop-prompt">
            <div className="drop-icon-wrap">
              <Icon name="upload" size={24} color="var(--accent)" strokeWidth={1.6} />
            </div>
            <div className="drop-text">
              <strong>Drop your PDF here</strong>
              <span>or click to browse</span>
            </div>
            <div className="drop-hint">PDF files up to 20 MB</div>
          </div>
        )}
      </div>

      {error && (
        <div className="error-msg">
          <Icon name="info" size={15} color="var(--error)" strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}

      {/* Mode selection */}
      {file && !loading && (
        <div className="mode-section fade-up">
          <p className="section-label">Choose mode</p>
          <div className="mode-cards">
            {[
              { id:'quiz',      icon:'brain', name:'Quiz Generator', desc:'MCQs with detailed answer explanations' },
              { id:'flashcard', icon:'cards', name:'Flashcards',      desc:'10 concise flip cards to memorize key concepts' },
            ].map(m => (
              <div key={m.id} className={`mode-card ${mode===m.id?'selected':''}`} onClick={() => setMode(mode===m.id?null:m.id)}>
                <div className="mode-icon-wrap">
                  <Icon name={m.icon} size={20} color={mode===m.id?'var(--accent)':'var(--text-muted)'} strokeWidth={1.5} />
                </div>
                <div className="mode-info">
                  <div className="mode-name">{m.name}</div>
                  <div className="mode-desc">{m.desc}</div>
                </div>
                <div className="mode-check">
                  <Icon name="check" size={12} color="#fff" strokeWidth={2.5} />
                </div>
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
                {DIFFICULTIES.map(d => (
                  <button key={d.value} className={`diff-btn ${difficulty===d.value?'active':''}`} onClick={() => setDifficulty(d.value)}>
                    <span className="diff-dot" style={{background: d.dot}} />
                    <span className="diff-label">{d.label}</span>
                    <span className="diff-desc">{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="config-summary">Generating <strong>{numQuestions} {difficulty}</strong> questions from <strong>{file.name}</strong></div>
          <button className="btn btn-primary btn-large" onClick={handleGenerateQuiz}>
            Generate Quiz
            <Icon name="arrowRight" size={16} color="#fff" strokeWidth={2} />
          </button>
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
          <button className="btn btn-primary btn-large" onClick={handleGenerateFlashcards}>
            Generate Flashcards
            <Icon name="arrowRight" size={16} color="#fff" strokeWidth={2} />
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading-box card fade-up">
          <div className="spinner" style={{width:24,height:24}} />
          <div>
            <div className="loading-main">{loadingMsg}</div>
            <div className="loading-sub">Usually takes 10–20 seconds</div>
          </div>
        </div>
      )}

      {/* Feature hints */}
      {!file && (
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-box">
              <div className="feature-box-icon-wrap">
                <Icon name={f.icon} size={16} color="var(--accent)" strokeWidth={1.6} />
              </div>
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
