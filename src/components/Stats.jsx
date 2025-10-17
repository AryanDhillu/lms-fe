const Stat = ({ icon, value, label }) => (
  <div className="stat">
    <div className="stat__icon">{icon}</div>
    <div className="stat__value">{value}</div>
    <div className="stat__label">{label}</div>
  </div>
);

export default function Stats() {
  return (
    <section className="stats">
      <div className="container stats__grid">
        <Stat icon={"👥"} value="50K+" label="Active Students" />
        <Stat icon={"📚"} value="1,200+" label="Courses Available" />
        <Stat icon={"👩‍🏫"} value="800+" label="Expert Instructors" />
        <Stat icon={"🏆"} value="95%" label="Success Rate" />
      </div>
    </section>
  );
}
