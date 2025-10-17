import { useState } from 'react'
import { enrollCourse } from '../api'

export default function CourseModal({ open, onClose, course, user, token, onLoginRequest }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  if (!open || !course) return null

  const canEnroll = (user && (user.role || '').toLowerCase() === 'student') && !!token

  const handleEnroll = async () => {
    if (!canEnroll) {
      onLoginRequest && onLoginRequest()
      return
    }
    try {
      setLoading(true)
      setResult(null)
      const data = await enrollCourse(course._id, token)
      setResult({ type: 'success', message: 'Enrolled successfully!' })
      console.log('Enroll result', data)
    } catch (e) {
      setResult({ type: 'error', message: e.message || 'Failed to enroll' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal__overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal__header">
          <h3>{course.title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="form" style={{ paddingTop: 4 }}>
          <div style={{ color: '#cfd7ff' }}>{course.description}</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, color: '#9aa6d1' }}>
            <div>Duration: {course.duration}</div>
            <div>Rating: {course.rating || 0}</div>
            <div>Price: {course.price === 0 ? 'Free' : `$${course.price}`}</div>
          </div>

          {result && (
            <div className={`alert ${result.type === 'error' ? 'alert--error' : 'alert--success'}`}>
              {result.message}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button className="btn btn--ghost" onClick={onClose}>Close</button>
            <button className="btn btn--primary" onClick={handleEnroll} disabled={loading}>
              {canEnroll ? (loading ? 'Enrolling…' : 'Enroll') : 'Login to Enroll'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
