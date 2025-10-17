import { useEffect, useState } from 'react';
import { getCourses } from '../api';
import { COURSE_IMAGES } from '../assets/courseImages';

const CourseCard = ({ title, description, duration, rating, price, image, actionLabel = 'View Course', onOpen }) => (
  <div className="course">
    <div className="course__media" style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
    <div className="course__badges">
      <span className="badge">Technology</span>
      <span className="badge badge--muted">All Levels</span>
    </div>
    <h3 className="course__title">{title}</h3>
    <p className="course__desc">{description}</p>
    <div className="course__meta">
      <div className="course__avatar">🧑‍🏫</div>
      <div className="course__instructor">
        <div className="course__time">{duration}</div>
      </div>
    </div>
    <div className="course__footer">
      <div className="course__rating">⭐ {rating || 0}</div>
      <div className="course__price">{price === 0 ? 'Free' : `$${price}`}</div>
    </div>
    <button className="btn btn--block btn--primary-outline" onClick={onOpen}>{actionLabel}</button>
  </div>
);

export default function PopularCourses({ user, onOpenCourse }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isStudent = (user?.role || '').toLowerCase() === 'student';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getCourses();
        if (!cancelled) setCourses(Array.isArray(data) ? data : data?.courses || []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load courses');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="popular">
      <div className="container">
        <h2 className="section__title">Popular Courses</h2>
        <p className="section__subtitle">Join thousands of learners in our most popular courses</p>
        {loading && (
          <div className="courses__grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="course skeleton">
                <div className="course__media" />
              </div>
            ))}
          </div>
        )}
        {!loading && error && (
          <div className="center" style={{ color: '#ffb4b4' }}>Error: {error}</div>
        )}
        {!loading && !error && (
          <div className="courses__grid">
            {courses.length === 0 ? (
              <div className="center" style={{ gridColumn: '1 / -1', color: '#9aa6d1' }}>No courses found.</div>
            ) : (
              courses.map((c, idx) => (
                <CourseCard
                  key={c._id}
                  title={c.title}
                  description={c.description}
                  duration={c.duration}
                  rating={c.rating}
                  price={c.price}
                  image={COURSE_IMAGES[idx % COURSE_IMAGES.length]}
                  actionLabel={isStudent ? 'Enroll' : 'View Course'}
                  onOpen={() => onOpenCourse && onOpenCourse(c)}
                />
              ))
            )}
          </div>
        )}
        <div className="center mt-24">
          <a className="btn btn--secondary" href="#">View All Courses</a>
        </div>
      </div>
    </section>
  );
}
