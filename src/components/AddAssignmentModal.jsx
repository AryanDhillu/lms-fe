import { useState } from 'react'
import { createAssignment } from '../api'

export default function AddAssignmentModal({ open, onClose, courseId, token, onCreated }) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('') // optional
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctIndex: 0 }
  ])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  if (!open) return null

  const updateQuestion = (idx, patch) => {
    setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, ...patch } : q))
  }
  const updateOption = (qIdx, optIdx, value) => {
    setQuestions(qs => qs.map((q, i) => {
      if (i !== qIdx) return q
      const opts = [...q.options]
      opts[optIdx] = value
      return { ...q, options: opts }
    }))
  }
  const setCorrect = (qIdx, optIdx) => {
    setQuestions(qs => qs.map((q, i) => i === qIdx ? { ...q, correctIndex: optIdx } : q))
  }
  const addQuestion = () => {
    setQuestions(qs => [...qs, { questionText: '', options: ['', '', ''], correctIndex: 0 }])
  }
  const removeQuestion = (idx) => {
    setQuestions(qs => qs.filter((_, i) => i !== idx))
  }
  const addOption = (qIdx) => {
    setQuestions(qs => qs.map((q,i) => {
      if (i !== qIdx) return q
      if (q.options.length >= 6) return q
      return { ...q, options: [...q.options, ''] }
    }))
  }
  const removeOption = (qIdx, optIdx) => {
    setQuestions(qs => qs.map((q,i) => {
      if (i !== qIdx) return q
      if (q.options.length <= 2) return q
      const next = q.options.filter((_, oi) => oi !== optIdx)
      let nextCorrect = q.correctIndex
      if (optIdx === q.correctIndex) nextCorrect = 0
      else if (optIdx < q.correctIndex) nextCorrect = Math.max(0, q.correctIndex - 1)
      return { ...q, options: next, correctIndex: nextCorrect }
    }))
  }

  const validate = () => {
    if (!title.trim()) return 'Title is required.'
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.questionText.trim()) return `Question ${i+1}: text is required.`
      const filled = q.options.filter(o => o && o.trim().length > 0)
      if (filled.length < 2) return `Question ${i+1}: at least 2 options are required.`
      if (q.correctIndex < 0 || q.correctIndex >= q.options.length) return `Question ${i+1}: select the correct answer.`
      const correctText = q.options[q.correctIndex]
      if (!correctText || !correctText.trim()) return `Question ${i+1}: correct answer cannot be empty.`
    }
    return null
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setResult(null)
    const error = validate()
    if (error) {
      setResult({ type: 'error', message: error })
      return
    }
    setLoading(true)
    try {
      // Build body as requested: { courseId, title, questions: [{ questionText, options, correctAnswer }] }
      const payload = {
        courseId,
        title: (title || '').trim(),
        questions: questions.map(q => {
          const options = q.options.map(o => (o ?? '').trim())
          const idx = Math.min(Math.max(q.correctIndex, 0), options.length - 1)
          return {
            questionText: (q.questionText || '').trim(),
            options,
            correctAnswer: options[idx]
          }
        })
      }
  // Log full request body for debugging
  console.log('Assignment request body (object):', payload)
  console.log('Assignment request body (JSON):', JSON.stringify(payload, null, 2))
  const data = await createAssignment(payload, token)
      setResult({ type: 'success', message: 'Assignment created successfully!' })
      onCreated && onCreated(data)
    } catch (err) {
      setResult({ type: 'error', message: err.message || 'Failed to create assignment' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal__overlay" role="dialog" aria-modal="true">
      <div className="modal" style={{ maxWidth: 820, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal__header" style={{ position: 'sticky', top: 0 }}>
          <h3>Create Assignment / Quiz</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form className="form" onSubmit={onSubmit} style={{ overflow: 'auto', paddingTop: 8 }}>
          <div className="field">
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="JavaScript Fundamentals Quiz" required />
          </div>
          <div className="field">
            <label>Due Date (optional)</label>
            <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <h4 style={{ margin: 0 }}>Questions ({questions.length})</h4>
            <button type="button" className="btn btn--secondary" onClick={addQuestion}>Add Question</button>
          </div>

          <div style={{ display: 'grid', gap: 16, marginTop: 8 }}>
            {questions.map((q, qi) => (
              <div key={qi} style={{ border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, padding: 12, background: '#0b1232' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontWeight: 700 }}>Question {qi + 1}</label>
                  {questions.length > 1 && (
                    <button type="button" className="btn btn--ghost" onClick={() => removeQuestion(qi)}>Remove</button>
                  )}
                </div>
                <textarea value={q.questionText} onChange={(e)=>updateQuestion(qi, { questionText: e.target.value })} placeholder="What keyword declares a variable that cannot be reassigned?" required rows={2} />

                <div className="field" style={{ marginTop: 8 }}>
                  <label style={{ display: 'block', marginBottom: 6 }}>Options (select the correct one)</label>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input type="radio" name={`correct-${qi}`} checked={q.correctIndex === oi} onChange={() => setCorrect(qi, oi)} aria-label={`Mark option ${oi+1} correct`} />
                        <input value={opt} onChange={(e)=>updateOption(qi, oi, e.target.value)} placeholder={`Option ${oi+1}`} required style={{ flex: 1 }} />
                        {q.options.length > 2 && (
                          <button type="button" className="btn btn--ghost" onClick={() => removeOption(qi, oi)} aria-label="Remove option">✕</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <button type="button" className="btn btn--ghost" onClick={() => addOption(qi)} disabled={q.options.length >= 6}>Add Option</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {result && (
            <div className={`alert ${result.type === 'error' ? 'alert--error' : 'alert--success'}`} style={{ marginTop: 12 }}>
              {result.message}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Creating…' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
