import { useEffect, useState } from 'react'
import { getCourseStudents } from '../api'

export default function CourseStudentsModal({ open, onClose, course, token }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [students, setStudents] = useState([])

  useEffect(() => {
    let cancelled = false
    // Don't run fetch when modal is closed or course is missing
    if (!open || !course?._id) {
      // Optionally reset when closed to avoid stale UI on next open
      setStudents([])
      setError(null)
      setLoading(false)
      return () => { cancelled = true }
    }

    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getCourseStudents(course._id, token)
        const arr = Array.isArray(data) ? data : data?.enrollments || []
        if (!cancelled) setStudents(arr)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to fetch students')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [open, course?._id, token])

  if (!open || !course) return null

  return (
    <div className="modal__overlay" role="dialog" aria-modal="true">
      <div className="modal" style={{ maxWidth: 640 }}>
        <div className="modal__header">
          <h3>Enrolled Students — {course.title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="form" style={{ paddingTop: 6 }}>
          {loading && <div style={{ color: '#9aa6d1' }}>Loading…</div>}
          {!loading && error && <div className="alert alert--error">{error}</div>}
          {!loading && !error && (
            students.length === 0 ? (
              <div style={{ color: '#9aa6d1' }}>No students enrolled yet.</div>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {students.map((en) => (
                  <div key={en._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, background: '#0b1232' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="user-chip__avatar" style={{ width: 28, height: 28 }}> {(en.student?.name || 'S').slice(0,1).toUpperCase()} </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{en.student?.name || 'Student'}</div>
                        <div style={{ color: '#9aa6d1', fontSize: 12 }}>{en.student?.email}</div>
                      </div>
                    </div>
                    <div style={{ color: '#9aa6d1', fontSize: 12 }}>Enrolled: {new Date(en.enrolledAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
