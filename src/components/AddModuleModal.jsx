import React, { useState } from 'react'

export default function AddModuleModal({ open, onClose, onCreated }) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [duration, setDuration] = useState('')

  if (!open) return null

  const submit = (e) => {
    e.preventDefault()
    const payload = {
      title: title.trim(),
      summary: summary.trim(),
      duration: duration.trim() || '—'
    }
    if (!payload.title) return
    onCreated && onCreated(payload)
  }

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal" onClick={(e)=> e.stopPropagation()}>
        <div className="modal__header">
          <h3>Add Module</h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <form className="form" onSubmit={submit}>
          <div className="field">
            <label>Title</label>
            <input value={title} onChange={(e)=> setTitle(e.target.value)} placeholder="Module title" />
          </div>
          <div className="field">
            <label>Summary</label>
            <input value={summary} onChange={(e)=> setSummary(e.target.value)} placeholder="Short summary" />
          </div>
          <div className="field">
            <label>Duration</label>
            <input value={duration} onChange={(e)=> setDuration(e.target.value)} placeholder="e.g. 30m" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary">Save Module</button>
          </div>
        </form>
      </div>
    </div>
  )
}
