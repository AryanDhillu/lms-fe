import { useEffect, useState } from 'react'
import { getMyCourses } from '../api'

export default function StudentDashboard({ token }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getMyCourses(token)
        // API may return an array of enrollments: [{ _id, student, course: {...}, enrolledAt }]
        const arr = Array.isArray(data) ? data : (data?.courses || data?.enrollments || [])
        const normalized = arr.map((item) => {
          // If shape is enrollment with embedded course
          if (item && item.course) {
            return { ...item.course, _enrollmentId: item._id, _enrolledAt: item.enrolledAt }
          }
          return item
        })
        if (!cancelled) setCourses(normalized)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to fetch your courses')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [token])

  return (
    <section className="container" style={{ padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 className="section__title" style={{ margin: 0, textAlign: 'left' }}>Student Dashboard</h2>
      </div>
      <p className="section__subtitle" style={{ textAlign: 'left' }}>Your enrolled courses.</p>

      {loading && (
        <div className="courses__grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="course skeleton"><div className="course__media" /></div>
          ))}
        </div>
      )}
      {!loading && error && (
        <div style={{ color: '#ffb4b4' }}>Error: {error}</div>
      )}
      {!loading && !error && (
        courses.length === 0 ? (
          <div style={{ color: '#9aa6d1' }}>You have not enrolled in any courses yet.</div>
        ) : (
          <div className="courses__grid">
            {courses.map((c) => (
              <div key={c._enrollmentId || c._id} className="course">
                <div className="course__media" />
                <div className="course__badges">
                  <span className="badge">Enrolled</span>
                </div>
                <h3 className="course__title">{c.title}</h3>
                <p className="course__desc">{c.description}</p>
                <div className="course__meta">
                  <div className="course__avatar">🎓</div>
                  <div className="course__instructor">
                    <div className="course__time">{c.duration}</div>
                    {c._enrolledAt && (
                      <div className="course__time" style={{ fontSize: 12 }}>Enrolled: {new Date(c._enrolledAt).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
                <div className="course__footer">
                  <div className="course__rating">⭐ {c.rating || 0}</div>
                  <div className="course__price">{c.price === 0 ? 'Free' : `$${c.price}`}</div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </section>
  )
}
