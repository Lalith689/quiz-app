import './LandingPage.css'

export default function LandingPage({ onStart }) {
  return (
    <div className="landing">

      {/* ── Minimal header ── */}
      <header className="landing-nav">
        <div className="landing-logo">
          <div className="landing-logo-icon">☕</div>
          <span>Study Companion</span>
        </div>
        <span className="landing-badge">CS2024 · Sem IV</span>
      </header>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            Powered by Gemini AI
          </div>

          <h1 className="hero-title">
            Study smarter,<br />
            <em>not harder.</em>
          </h1>

          <p className="hero-subtitle">
            Upload any PDF — lecture notes, textbook chapters, syllabuses —
            and instantly get quizzes or flashcards tailored to the content.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary btn-large landing-cta" onClick={onStart}>
              Get started →
            </button>
            <p className="hero-hint">No sign-up · Free to use</p>
          </div>
        </div>

        {/* ── Floating cards decoration ── */}
        <div className="hero-visual" aria-hidden="true">
          <div className="float-card float-card-1">
            <div className="fc-icon">🧠</div>
            <div className="fc-lines">
              <div className="fc-line fc-line-long" />
              <div className="fc-line fc-line-short" />
            </div>
          </div>
          <div className="float-card float-card-2">
            <div className="fc-icon">🃏</div>
            <div className="fc-lines">
              <div className="fc-line fc-line-long" />
              <div className="fc-line fc-line-med" />
            </div>
          </div>
          <div className="float-card float-card-3">
            <div className="fc-score">
              <span className="score-val">8</span>
              <span className="score-of">/10</span>
            </div>
            <div className="fc-score-label">Quiz score</div>
          </div>
          <div className="float-pill float-pill-1">Method Overriding</div>
          <div className="float-pill float-pill-2">Encapsulation</div>
          <div className="float-pill float-pill-3">Try-Catch</div>
        </div>
      </section>

      {/* ── Features strip ── */}
      <section className="landing-features">
        <div className="feature-strip">
          <div className="feature-item-land">
            <div className="fi-icon">📄</div>
            <div>
              <div className="fi-title">Upload any PDF</div>
              <div className="fi-desc">Notes, textbooks, syllabuses</div>
            </div>
          </div>
          <div className="feature-divider" />
          <div className="feature-item-land">
            <div className="fi-icon">🎯</div>
            <div>
              <div className="fi-title">5, 10 or 15 questions</div>
              <div className="fi-desc">3 difficulty levels</div>
            </div>
          </div>
          <div className="feature-divider" />
          <div className="feature-item-land">
            <div className="fi-icon">💡</div>
            <div>
              <div className="fi-title">Detailed explanations</div>
              <div className="fi-desc">Learn why each answer is right</div>
            </div>
          </div>
          <div className="feature-divider" />
          <div className="feature-item-land">
            <div className="fi-icon">🃏</div>
            <div>
              <div className="fi-title">10 Flashcards</div>
              <div className="fi-desc">Flip to reveal key concepts</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        Built for OOP with Java · RV University
      </footer>
    </div>
  )
}
