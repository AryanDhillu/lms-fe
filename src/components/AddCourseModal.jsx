import { useState } from 'react'
import { createCourse } from '../api'

export default function AddCourseModal({ open, onClose, token, onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', duration: '', price: '', rating: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  if (!open) return null

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const payload = { ...form, price: Number(form.price || 0), rating: Number(form.rating || 0) }
      const data = await createCourse(payload, token)
      setResult({ type: 'success', message: 'Course created successfully!' })
      onCreated && onCreated(data)
      setTimeout(onClose, 700)
    } catch (err) {
      setResult({ type: 'error', message: err.message || 'Failed to create course' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal__overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal__header">
          <h3>Add Course</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form className="form" onSubmit={submit}>
          <div className="field">
            <label>Title</label>
            <input name="title" value={form.title} onChange={update} placeholder="Data Structures & Algorithms" required />
          </div>
          <div className="field">
            <label>Description</label>
            <input name="description" value={form.description} onChange={update} placeholder="Master essential data structures." required />
          </div>
          <div className="field">
            <label>Duration</label>
            <input name="duration" value={form.duration} onChange={update} placeholder="9 weeks" required />
          </div>
          <div className="field" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label>Price</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={update} placeholder="69.99" />
            </div>
            <div>
              <label>Rating</label>
              <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={update} placeholder="4.9" />
            </div>
          </div>

          {result && (
            <div className={`alert ${result.type === 'error' ? 'alert--error' : 'alert--success'}`}>
              {result.message}
            </div>
          )}

          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Creating…' : 'Create Course'}
          </button>
        </form>
      </div>
    </div>
  )
}
