const Category = ({ icon, title, count, active, onClick }) => (
  <button className="category" onClick={onClick} aria-pressed={!!active} style={{ cursor: 'pointer' }}>
    <div className="category__icon">{icon}</div>
    <div className="category__title">{title}</div>
    <div className="category__count">{count} courses</div>
  </button>
);

export default function Categories({ selected, onSelect }) {
  const data = [
    { icon: "<>", title: "Technology", count: 156 },
    { icon: "📋", title: "Business", count: 89 },
    { icon: "🎨", title: "Design", count: 67 },
    { icon: "💰", title: "Finance", count: 45 },
    { icon: "📣", title: "Marketing", count: 78 },
    { icon: "💚", title: "Health", count: 34 },
  ];
  return (
    <section className="categories">
      <div className="container">
        <h2 className="section__title">Explore Course Categories</h2>
        <p className="section__subtitle">Discover courses across various disciplines and find your passion</p>
        <div className="categories__grid">
          {data.map((c) => (
            <Category key={c.title} {...c} active={selected === c.title} onClick={() => onSelect && onSelect(c.title)} />
          ))}
        </div>
      </div>
    </section>
  );
}
