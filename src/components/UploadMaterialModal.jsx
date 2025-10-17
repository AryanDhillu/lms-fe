import React, { useState } from 'react'
import { updateCourse } from '../api'

export default function UploadMaterialModal({ open, onClose, course, token, onUpdated }) {
  const [url, setUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  if (!open || !course?._id) return null

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    const materialUrl = url.trim()
    if (!materialUrl) { setError('Please enter a valid URL'); return }
    try {
      setSaving(true)
      const updated = await updateCourse(course._id, { materialUrl }, token)
      onUpdated && onUpdated(updated)
    } catch (e) {
      setError(e.message || 'Failed to update course')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal" onClick={(e)=> e.stopPropagation()}>
        <div className="modal__header">
          <h3>Upload Material</h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <form className="form" onSubmit={submit}>
          <div className="field">
            <label>Material URL</label>
            <input value={url} onChange={(e)=> setUrl(e.target.value)} placeholder="https://.../document.pdf" />
          </div>
          {error && <div className="alert alert--error">{error}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
