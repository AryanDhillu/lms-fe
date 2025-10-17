export default function Hero({ onSignUp }) {
  return (
    <section className="hero">
      <div className="hero__orb hero__orb--one" />
      <div className="hero__orb hero__orb--two" />
      <div className="container hero__wrap">
        <div className="hero__left">
          <div className="hero__badge">AI-Powered Learning Platform</div>
          <h1 className="hero__title">Level up with <span>EduPro</span></h1>
          <p className="hero__subtitle">Build real skills with bite-sized modules, hands-on projects, and quizzes that grade themselves. Learn faster—with a little AI magic.</p>
          <div className="hero__cta">
            <button className="btn btn--primary" onClick={() => onSignUp && onSignUp('Student')}>Join as Student</button>
            <button className="btn btn--secondary" onClick={() => onSignUp && onSignUp('Teacher')}>Join as Teacher</button>
          </div>
          <div className="hero__meta">
            <div className="hero__avatars">
              <span className="hero__avatar">A</span>
              <span className="hero__avatar">K</span>
              <span className="hero__avatar">S</span>
              <span className="hero__avatar">M</span>
            </div>
            <div className="hero__rating">
              ⭐⭐⭐⭐⭐ <span>4.9/5 by 20k+ learners</span>
            </div>
          </div>
        </div>

        <div className="hero__right">
          <div className="hero__card">
            <div className="hero__card-header">
              <div className="dot" />
              <div className="dot" />
              <div className="dot" />
            </div>
            <div className="hero__video" />
            <div className="hero__bullets">
              <div className="hero__bullet">✔ Interactive lessons</div>
              <div className="hero__bullet">✔ Auto-graded quizzes</div>
              <div className="hero__bullet">✔ Teacher dashboards</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
