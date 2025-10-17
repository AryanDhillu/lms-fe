import { useEffect, useMemo, useState } from 'react'
import { getMyCourses, getCourseAssignments } from '../api'
import TakeAssignmentModal from './TakeAssignmentModal'
import CourseFeedbackModal from './CourseFeedbackModal'

export default function StudentDashboard({ token }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [assignLoading, setAssignLoading] = useState(false)
  const [assignError, setAssignError] = useState(null)
  const [activeModuleIndex, setActiveModuleIndex] = useState(0)
  const [activeAssignment, setActiveAssignment] = useState(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  // Sum of grades for submitted assignments in the selected course
  const totalSubmittedScore = useMemo(() => {
    try {
      return (assignments || []).reduce((sum, a) => {
        const val = (a && a.isSubmitted && typeof a.score === 'number') ? a.score : 0
        return sum + val
      }, 0)
    } catch { return 0 }
  }, [assignments])

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

  // Curated image set for module content thumbnails
  const MODULE_THUMBS = [
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1454165205744-3b78555e5572?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1537432376769-00a5df5c0f7b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop'
  ]

  // Generate a pseudo-random but stable list of modules per course
  const generateModules = (course) => {
    if (!course) return []
    const titles = ['Introduction', 'Getting Started', 'Core Concepts', 'Hands-on Practice', 'Advanced Topics', 'Project', 'Wrap-up']
    const count = Math.max(4, Math.min(7, Math.floor(4 + ((course.title || '').length % 4))))
    return Array.from({ length: count }).map((_, i) => {
      const base = i * 3
      const images = [
        { id: `m${i}-1`, thumb: MODULE_THUMBS[(base + 0) % MODULE_THUMBS.length], label: 'Concept' },
        { id: `m${i}-2`, thumb: MODULE_THUMBS[(base + 1) % MODULE_THUMBS.length], label: 'Example' },
        { id: `m${i}-3`, thumb: MODULE_THUMBS[(base + 2) % MODULE_THUMBS.length], label: 'Practice' }
      ]
      const topic = titles[i % titles.length]
      return {
        title: `Module ${i + 1}: ${topic}`,
        summary: `In this module, you'll explore ${topic.toLowerCase()} for ${course.title}.`,
        details: `This section deep-dives into ${topic.toLowerCase()} with practical, bite-sized content tailored for ${course.title}. By the end, you'll be able to apply the concepts confidently with real-world examples.`,
        topics: [
          `Why ${topic.toLowerCase()} matters`,
          `Key patterns for ${course.title}`,
          `Common pitfalls and best practices`,
          `Mini challenge: apply ${topic.toLowerCase()}`
        ],
        videos: images
      }
    })
  }

  const modules = useMemo(() => generateModules(selectedCourse), [selectedCourse])

  useEffect(() => {
    let cancelled = false
    if (!selectedCourse?._id) { setAssignments([]); setAssignError(null); setAssignLoading(false); return }
    ;(async () => {
      try {
        setAssignLoading(true)
        setAssignError(null)
        const data = await getCourseAssignments(selectedCourse._id, token)
        const list = Array.isArray(data) ? data : (data?.assignments || [])
        if (!cancelled) setAssignments(list)
      } catch (e) {
        if (!cancelled) setAssignError(e.message || 'Failed to fetch assignments')
      } finally {
        if (!cancelled) setAssignLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [selectedCourse?._id, token])

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
            {courses.map((c) => {
              const isSelected = selectedCourse?._id === (c._id || c.id)
              if (selectedCourse && !isSelected) return null
              return (
                <div key={c._enrollmentId || c._id} className="course" style={{ gridColumn: isSelected ? '1 / -1' : undefined, cursor: isSelected ? 'default' : 'pointer' }} onClick={() => { if (!isSelected) { setSelectedCourse(c); setActiveModuleIndex(0) } }}>
                  <div className="course__media" />
                  <div className="course__badges">
                    <span className="badge">Enrolled</span>
                    {isSelected && <span className="badge" style={{ background: 'var(--brand)' }}>Selected</span>}
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

                  {isSelected && (
                    <div style={{ marginTop: 14 }}>
                      {/* Selected course header with Back + highlighted Download */}
                      <div className="sd__header" onClick={(e)=> e.stopPropagation()}>
                        <div className="sd__title-wrap">
                          <button
                            className="btn btn--ghost sd__back"
                            onClick={(e)=>{ e.stopPropagation(); setSelectedCourse(null) }}
                            title="Back to courses"
                          >
                            ← Back
                          </button>
                          <div>
                            <div className="sd__title">{c.title}</div>
                            {c._enrolledAt && (
                              <div className="sd__subtitle">Enrolled: {new Date(c._enrolledAt).toLocaleDateString()}</div>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          {selectedCourse?.materialUrl && (
                            <a
                              className="btn btn--primary sd-download"
                              href={selectedCourse.materialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e)=> e.stopPropagation()}
                            >
                              ⬇ Download Material
                            </a>
                          )}
                          <button
                            className="btn btn--secondary"
                            onClick={(e)=> { e.stopPropagation(); setFeedbackOpen(true) }}
                          >
                            ✍️ Submit Feedback
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
                        {/* Modules sidebar */}
                        <div style={{ border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, padding: 12, background: '#0b1232' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <h4 style={{ margin: 0 }}>Modules</h4>
                          </div>
                          <div style={{ display: 'grid', gap: 8 }}>
                            {modules.map((m, i) => (
                              <button key={i} className="btn btn--primary-outline" style={{ justifyContent: 'space-between', padding: '10px 12px', borderColor: i === activeModuleIndex ? 'var(--brand)' : undefined }} onClick={(e)=>{ e.stopPropagation(); setActiveModuleIndex(i) }}>
                                <span>{m.title}</span>
                                {i === activeModuleIndex && <span>▶</span>}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Module content */}
                        <div style={{ border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, padding: 12, background: '#0b1232' }}>
                          <h4 style={{ marginTop: 0 }}>{modules[activeModuleIndex]?.title || 'Module'}</h4>
                          <p style={{ color: '#cfd7ff' }}>{modules[activeModuleIndex]?.summary}</p>
                          {modules[activeModuleIndex]?.details && (
                            <p style={{ color: '#9aa6d1' }}>{modules[activeModuleIndex].details}</p>
                          )}
                          {modules[activeModuleIndex]?.topics && (
                            <ul style={{ color: '#cfd7ff', marginTop: 8 }}>
                              {modules[activeModuleIndex].topics.map((t, ti) => (
                                <li key={ti}>{t}</li>
                              ))}
                            </ul>
                          )}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 10 }}>
                            {modules[activeModuleIndex]?.videos.map((v) => (
                              <div key={v.id} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,.12)' }}>
                                <div style={{ background: `url(${v.thumb}) center/cover no-repeat`, height: 110 }} />
                                <div style={{ padding: '6px 8px', fontSize: 12, color: '#cfd7ff' }}>{v.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Assignments list */}
                      <div style={{ marginTop: 16, border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, padding: 12, background: '#0b1232' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                          <h4 style={{ marginTop: 0, marginBottom: 0 }}>Assignments</h4>
                          <div className="sd-total-pill">🏆 Total Grade: <span>{totalSubmittedScore}</span></div>
                        </div>
                        {assignLoading && <div style={{ color: '#9aa6d1' }}>Loading assignments…</div>}
                        {!assignLoading && assignError && <div className="alert alert--error">{assignError}</div>}
                        {!assignLoading && !assignError && (
                          assignments.length === 0 ? (
                            <div style={{ color: '#9aa6d1' }}>No assignments for this course yet.</div>
                          ) : (
                            <div style={{ display: 'grid', gap: 10 }}>
                              {assignments.map((a) => (
                                <div key={a._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, background: '#0b1232' }}>
                                  <div>
                                    <div style={{ fontWeight: 700 }}>{a.title}</div>
                                    {a.dueDate && <div style={{ fontSize: 12, color: '#9aa6d1' }}>Due: {new Date(a.dueDate).toLocaleString()}</div>}
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {a.isSubmitted ? (
                                      <span className="badge" style={{ background: '#22c55e' }}>Submitted {a.score != null ? `• Score: ${a.score}` : ''}</span>
                                    ) : (
                                      <>
                                        <span className="badge badge--muted">Not Submitted</span>
                                        <button className="btn btn--secondary" onClick={(e)=>{ e.stopPropagation(); setActiveAssignment(a) }}>Attempt</button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      )}

      <TakeAssignmentModal
        open={!!activeAssignment}
        onClose={() => setActiveAssignment(null)}
        assignment={activeAssignment}
        token={token}
        onSubmitted={() => {
          setActiveAssignment(null)
          // Refresh assignments list to reflect submitted status
          if (selectedCourse?._id) {
            (async () => {
              try {
                setAssignLoading(true)
                const data = await getCourseAssignments(selectedCourse._id, token)
                const list = Array.isArray(data) ? data : (data?.assignments || [])
                setAssignments(list)
              } catch (e) {
                setAssignError(e.message || 'Failed to fetch assignments')
              } finally {
                setAssignLoading(false)
              }
            })()
          }
        }}
      />

      <CourseFeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        course={selectedCourse}
        token={token}
        onSubmitted={() => {
          setFeedbackOpen(false)
        }}
      />
    </section>
  )
}
