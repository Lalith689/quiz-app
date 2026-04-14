import Icon from './Icons.jsx'
import './LandingPage.css'

export default function LandingPage({ onStart }) {
  return (
    <div className="landing">

      <header className="landing-nav">
        <div className="landing-logo">
          <div className="landing-logo-icon">
            <Icon name="coffee" size={17} color="#fff" strokeWidth={1.8} />
          </div>
          <span>Study Companion</span>
        </div>
        <span className="landing-badge">CS2024 · Sem IV</span>
      </header>

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
              Get started
              <Icon name="arrowRight" size={16} color="#fff" strokeWidth={2} />
            </button>
            <p className="hero-hint">No sign-up · Free to use</p>
          </div>
        </div>

        {/* Floating visual decoration */}
        <div className="hero-visual" aria-hidden="true">
          <div className="float-card float-card-1">
            <div className="fc-icon-wrap">
              <Icon name="brain" size={20} color="var(--accent)" strokeWidth={1.5} />
            </div>
            <div className="fc-lines">
              <div className="fc-line fc-line-long" />
              <div className="fc-line fc-line-short" />
            </div>
          </div>

          <div className="float-card float-card-2">
            <div className="fc-icon-wrap">
              <Icon name="cards" size={20} color="var(--accent)" strokeWidth={1.5} />
            </div>
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

      <section className="landing-features">
        <div className="feature-strip">
          {[
            { icon: 'file',     title: 'Upload any PDF',        desc: 'Notes, textbooks, syllabuses' },
            { icon: 'target',   title: '5, 10 or 15 questions', desc: '3 difficulty levels' },
            { icon: 'lightbulb',title: 'Detailed explanations', desc: 'Learn from every answer' },
            { icon: 'cards',    title: '10 flip cards',          desc: 'Core concepts to memorize' },
          ].map((f, i) => (
            <div key={f.title} style={{display:'contents'}}>
              {i > 0 && <div className="feature-divider" />}
              <div className="feature-item-land">
                <div className="fi-icon-wrap">
                  <Icon name={f.icon} size={16} color="var(--accent)" strokeWidth={1.6} />
                </div>
                <div>
                  <div className="fi-title">{f.title}</div>
                  <div className="fi-desc">{f.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        Built for OOP with Java · RV University
      </footer>
    </div>
  )
}
