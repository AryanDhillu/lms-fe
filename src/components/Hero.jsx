export default function Hero({ onSignUp }) {
  return (
    <section className="hero">
      <div className="container hero__content">
        <div className="hero__badge">AI-Powered Learning Platform</div>
        <h1 className="hero__title">Welcome to <span>EduPro</span></h1>
        <p className="hero__subtitle">Transform your learning journey with our comprehensive AI-powered platform. Join thousands of students and teachers creating the future of education.</p>
        <div className="hero__cta">
          <button className="btn btn--primary" onClick={() => onSignUp && onSignUp('Student')}>Join as Student</button>
          <button className="btn btn--secondary" onClick={() => onSignUp && onSignUp('Teacher')}>Join as Teacher</button>
        </div>
      </div>
    </section>
  );
}
