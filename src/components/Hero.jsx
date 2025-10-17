export default function Hero({ onSignUp }) {
  return (
    <section className="hero hero--simple">
      <div className="container">
        <div className="hero__center">
          <div className="hero__badge">Learn. Build. Grow.</div>
          <h1 className="hero__title">Skill up with <span>EduPro</span></h1>
          <p className="hero__subtitle">Simple, practical courses to help you learn faster and get job‑ready.</p>
          <div className="hero__cta">
            <button className="btn btn--primary" onClick={() => onSignUp && onSignUp('Student')}>Get Started</button>
            <button className="btn btn--secondary" onClick={() => onSignUp && onSignUp('Teacher')}>Teach on EduPro</button>
          </div>
        </div>
      </div>
    </section>
  )
}
