import { useState } from 'react'
import { submitCourseFeedback } from '../api'

export default function CourseFeedbackModal({ open, onClose, course, token, onSubmitted }) {
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!course?._id) return
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      await submitCourseFeedback(course._id, { rating, feedback }, token)
      setSuccess('Thanks for your feedback!')
      setFeedback('')
      if (onSubmitted) onSubmitted()
      // Close after a small delay
      setTimeout(() => { onClose?.() }, 700)
    } catch (err) {
      setError(err.message || 'Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal" onClick={(e)=> e.stopPropagation()}>
        <div className="modal__header">
          <h3>Submit Feedback</h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Course</label>
            <div style={{ fontWeight: 800 }}>{course?.title}</div>
          </div>

          <div className="field">
            <label>Rating</label>
            <select value={rating} onChange={(e)=> setRating(Number(e.target.value))}>
              {[5,4,3,2,1].map(n => (
                <option key={n} value={n}>{n} {n===1 ? 'star' : 'stars'}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Feedback</label>
            <textarea
              value={feedback}
              onChange={(e)=> setFeedback(e.target.value)}
              rows={5}
              placeholder="Share your thoughts about this course..."
              style={{ resize: 'vertical', minHeight: 120, padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(255,255,255,.12)', background: '#10131a', color: 'var(--text)' }}
              required
            />
          </div>

          {error && <div className="alert alert--error">{error}</div>}
          {success && <div className="alert alert--success">{success}</div>}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={loading}>{loading ? 'Submitting…' : 'Submit'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
