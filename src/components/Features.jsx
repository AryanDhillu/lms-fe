export default function Features() {
  const items = [
    {
      title: 'AI-Powered Learning',
      desc: 'Personalized learning paths adapted to your pace and style with advanced AI algorithms.'
    },
    {
      title: 'Expert Instructors',
      desc: 'Learn from industry professionals and academic experts with years of experience'
    },
    {
      title: 'Verified Certificates',
      desc: 'Earn recognized certificates to advance your career and showcase your achievements'
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <h2 className="section__title">Why Choose EduPro?</h2>
        <p className="section__subtitle">Experience the future of online learning with cutting-edge technology</p>
        <div className="features__grid">
          {items.map((f) => (
            <div key={f.title} className="feature">
              <div className="feature__icon">✨</div>
              <div className="feature__title">{f.title}</div>
              <div className="feature__desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
