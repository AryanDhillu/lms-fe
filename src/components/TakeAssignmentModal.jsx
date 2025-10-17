import { useMemo, useState } from 'react'
import { submitAssignment } from '../api'

export default function TakeAssignmentModal({ open, onClose, assignment, token, onSubmitted }) {
  const [answers, setAnswers] = useState({}) // key by questionText -> selectedAnswer
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const questions = useMemo(() => assignment?.questions || [], [assignment])

  if (!open || !assignment) return null

  const select = (questionText, selectedAnswer) => {
    setAnswers((prev) => ({ ...prev, [questionText]: selectedAnswer }))
  }

  const buildPayload = () => {
    return {
      answers: questions.map(q => ({
        questionText: q.questionText,
        selectedAnswer: answers[q.questionText] ?? ''
      }))
    }
  }

  const canSubmit = questions.length > 0 && questions.every(q => (answers[q.questionText] ?? '').trim().length > 0)

  const onSubmit = async (e) => {
    e.preventDefault()
    setResult(null)
    const payload = buildPayload()
    try {
      setLoading(true)
      const data = await submitAssignment(assignment._id, payload, token)
      setResult({ type: 'success', message: 'Submission successful!' })
      onSubmitted && onSubmitted(data)
    } catch (err) {
      setResult({ type: 'error', message: err.message || 'Failed to submit assignment' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal__overlay" role="dialog" aria-modal="true">
      <div className="modal" style={{ maxWidth: 800 }}>
        <div className="modal__header">
          <h3>{assignment.title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form className="form" onSubmit={onSubmit}>
          {questions.map((q, idx) => (
            <div key={q._id || idx} style={{ border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, padding: 12, background: '#0b1232' }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{idx + 1}. {q.questionText}</div>
              <div style={{ display: 'grid', gap: 8 }}>
                {q.options.map((opt, oi) => (
                  <label key={oi} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="radio"
                      name={`q-${idx}`}
                      checked={(answers[q.questionText] || '') === opt}
                      onChange={() => select(q.questionText, opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {result && (
            <div className={`alert ${result.type === 'error' ? 'alert--error' : 'alert--success'}`}>
              {result.message}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={!canSubmit || loading}>
              {loading ? 'Submitting…' : 'Submit Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
