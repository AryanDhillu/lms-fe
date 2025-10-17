export default function CTA({ onSignUp }) {
  return (
    <section className="cta">
      <div className="container cta__content">
        <h2 className="cta__title">Ready to Start Learning?</h2>
        <p className="cta__subtitle">Join over 50,000 students and teachers already transforming their future with EduPro</p>
        <div className="cta__actions">
          <button className="btn btn--primary" onClick={() => onSignUp && onSignUp('Student')}>Get Started Free</button>
          <button className="btn btn--ghost" onClick={() => onSignUp && onSignUp('Student')}>Browse Courses</button>
        </div>
      </div>
    </section>
  );
}
