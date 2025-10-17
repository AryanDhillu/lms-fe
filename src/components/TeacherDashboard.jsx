import { useEffect, useState } from 'react'
import { getCourses, getCourseStudents, getAssignmentsTeacherView, getAssignmentSubmissions } from '../api'
import AddAssignmentModal from './AddAssignmentModal'

export default function TeacherDashboard({ onAddCourse, user, refreshSignal, token }) {
  // Courses
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [myCourses, setMyCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)

  // Tabs
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'students' | 'assignments'

  // Students
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [studentsError, setStudentsError] = useState(null)
  const [students, setStudents] = useState([])

  // Assignments
  const [showAddAssignment, setShowAddAssignment] = useState(false)
  const [assignmentsLoading, setAssignmentsLoading] = useState(false)
  const [assignmentsError, setAssignmentsError] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [assignmentsRefresh, setAssignmentsRefresh] = useState(0)

  // Submissions (for selected assignment)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [subsLoading, setSubsLoading] = useState(false)
  const [subsError, setSubsError] = useState(null)
  const [submissions, setSubmissions] = useState([])

  const teacherId = user?._id || user?.id

  // Load teacher courses
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getCourses()
        const all = Array.isArray(data) ? data : data?.courses || []
        const mine = all.filter((c) => {
          const cTeacherId = typeof c.teacher === 'string' ? c.teacher : (c.teacher?._id || c.teacher?.id)
          return teacherId && cTeacherId === teacherId
        })
        if (!cancelled) setMyCourses(mine)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to fetch courses')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [teacherId, refreshSignal])

  // Reset when course changes
  useEffect(() => {
    setActiveTab('overview')
    setSelectedAssignment(null)
    setSubmissions([])
  }, [selectedCourse?._id])

  // Fetch students on select
  useEffect(() => {
    let cancelled = false
    if (!selectedCourse?._id) {
      setStudents([])
      setStudentsError(null)
      setStudentsLoading(false)
      return () => { cancelled = true }
    }
    ;(async () => {
      try {
        setStudentsLoading(true)
        setStudentsError(null)
        const data = await getCourseStudents(selectedCourse._id, token)
        const arr = Array.isArray(data) ? data : data?.enrollments || []
        if (!cancelled) setStudents(arr)
      } catch (e) {
        if (!cancelled) setStudentsError(e.message || 'Failed to fetch students')
      } finally {
        if (!cancelled) setStudentsLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [selectedCourse?._id, token])

  // Fetch assignments when on assignments tab
  useEffect(() => {
    let cancelled = false
    if (!selectedCourse?._id || activeTab !== 'assignments') {
      setAssignments([])
      setAssignmentsError(null)
      setAssignmentsLoading(false)
      return () => { cancelled = true }
    }
    ;(async () => {
      try {
        setAssignmentsLoading(true)
        setAssignmentsError(null)
        const data = await getAssignmentsTeacherView(selectedCourse._id, token)
        const arr = Array.isArray(data) ? data : (data?.assignments || [])
        if (!cancelled) setAssignments(arr)
      } catch (e) {
        if (!cancelled) setAssignmentsError(e.message || 'Failed to fetch assignments')
      } finally {
        if (!cancelled) setAssignmentsLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [selectedCourse?._id, token, activeTab, assignmentsRefresh])

  // Fetch submissions when an assignment is expanded
  useEffect(() => {
    let cancelled = false
    if (activeTab !== 'assignments' || !selectedAssignment?._id) {
      setSubmissions([])
      setSubsError(null)
      setSubsLoading(false)
      return () => { cancelled = true }
    }
    ;(async () => {
      try {
        setSubsLoading(true)
        setSubsError(null)
        const data = await getAssignmentSubmissions(selectedAssignment._id, token)
        const arr = Array.isArray(data) ? data : (data?.submissions || [])
        if (!cancelled) setSubmissions(arr)
      } catch (e) {
        if (!cancelled) setSubsError(e.message || 'Failed to fetch submissions')
      } finally {
        if (!cancelled) setSubsLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [selectedAssignment?._id, token, activeTab])

  const courseItem = (c) => {
    const active = selectedCourse?._id === c._id
    return (
      <button key={c._id} className={`td-course ${active ? 'td-course--active' : ''}`} onClick={() => setSelectedCourse(c)}>
        <div className="td-course__title">{c.title}</div>
        <div className="td-course__meta">{c.duration || '—'} • ⭐ {c.rating || 0}</div>
      </button>
    )
  }

  return (
    <section className="td container">
      <div className="td__header">
        <div>
          <h2 className="td__title">Teacher Dashboard</h2>
          <div className="td__subtitle">Create courses, manage students, and track assignments</div>
        </div>
        <div className="td__actions">
          <button className="btn btn--primary" onClick={onAddCourse}>Add Course</button>
        </div>
      </div>

      <div className="td__layout">
        <aside className="td__sidebar">
          <div className="td__side-header">My Courses</div>
          {loading ? (
            <div className="td__skeleton-list">
              {Array.from({ length: 3 }).map((_, i) => (<div key={i} className="td-skel" />))}
            </div>
          ) : error ? (
            <div className="alert alert--error">{error}</div>
          ) : (
            myCourses.length === 0 ? (
              <div className="td__empty">You have not created any courses yet.</div>
            ) : (
              <div className="td-course-list">
                {myCourses.map(courseItem)}
              </div>
            )
          )}
        </aside>

        <main className="td__main">
          {!selectedCourse ? (
            <div className="td__welcome">
              <div className="td-card">
                <div className="td-card__title">Welcome!</div>
                <div className="td-card__desc">Select a course from the left to view details, students, and assignments.</div>
              </div>
            </div>
          ) : (
            <div className="td__content">
              <div className="td-course-hero td-card">
                <div className="td-course-hero__head">
                  <div>
                    <div className="td-course-hero__title">{selectedCourse.title}</div>
                    <div className="td-course-hero__desc">{selectedCourse.description}</div>
                  </div>
                  <div className="td-chips">
                    <span className="td-chip">{selectedCourse.duration || '—'}</span>
                    <span className="td-chip">⭐ {selectedCourse.rating || 0}</span>
                    <span className="td-chip">{selectedCourse.price === 0 ? 'Free' : `$${selectedCourse.price}`}</span>
                  </div>
                </div>
              </div>

              <div className="td-tabs">
                {['overview','students','assignments'].map((t) => (
                  <button key={t} className={`td-tab ${activeTab === t ? 'td-tab--active' : ''}`} onClick={() => setActiveTab(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && (
                <div className="td-grid-2">
                  <div className="td-card">
                    <div className="td-card__title">Students</div>
                    <div className="td-metric">{students.length}</div>
                    <div className="td-card__desc">Total enrolled students</div>
                  </div>
                  <div className="td-card">
                    <div className="td-card__title">Assignments</div>
                    <div className="td-metric">{assignments.length}</div>
                    <div className="td-card__desc">Assignments in this course</div>
                  </div>
                </div>
              )}

              {activeTab === 'students' && (
                <div className="td-panel">
                  <div className="td-panel__title">Enrolled Students</div>
                  <div className="td-panel__body">
                    {studentsLoading && <div style={{ color: '#9aa6d1' }}>Loading…</div>}
                    {!studentsLoading && studentsError && <div className="alert alert--error">{studentsError}</div>}
                    {!studentsLoading && !studentsError && (
                      students.length === 0 ? (
                        <div className="td__empty">No students enrolled yet.</div>
                      ) : (
                        <div className="td-list">
                          {students.map((en) => (
                            <div key={en._id} className="td-list-item">
                              <div className="td-list-item__left">
                                <div className="user-chip__avatar" style={{ width: 28, height: 28 }}>{(en.student?.name || 'S').slice(0,1).toUpperCase()}</div>
                                <div>
                                  <div className="td-list-item__title">{en.student?.name || 'Student'}</div>
                                  <div className="td-list-item__meta">{en.student?.email}</div>
                                </div>
                              </div>
                              <div className="td-list-item__right">Enrolled: {new Date(en.enrolledAt).toLocaleDateString()}</div>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'assignments' && (
                <div className="td-panel">
                  <div className="td-panel__title-row">
                    <div className="td-panel__title">Assignments</div>
                    <div className="td__actions">
                      <button className="btn btn--secondary" onClick={() => setShowAddAssignment(true)}>Add Assignment</button>
                    </div>
                  </div>
                  <div className="td-panel__body">
                    {assignmentsLoading && <div style={{ color: '#9aa6d1' }}>Loading…</div>}
                    {!assignmentsLoading && assignmentsError && <div className="alert alert--error">{assignmentsError}</div>}
                    {!assignmentsLoading && !assignmentsError && (
                      assignments.length === 0 ? (
                        <div className="td__empty">No assignments yet.</div>
                      ) : (
                        <div className="td-list">
                          {assignments.map((a) => (
                            <div key={a._id} className="td-list-item td-list-item--stack">
                              <div className="td-list-item__row">
                                <div>
                                  <div className="td-list-item__title">{a.title}</div>
                                  <div className="td-list-item__meta">Due: {a.dueDate ? new Date(a.dueDate).toLocaleString() : '—'} • Questions: {a.questions?.length ?? 0} • Submissions: {a.submissionCount ?? 0}</div>
                                </div>
                                <div>
                                  <button className="btn btn--primary-outline" onClick={() => setSelectedAssignment(prev => (prev?._id === a._id ? null : a))}>
                                    {selectedAssignment?._id === a._id ? 'Hide' : 'View Assignment'}
                                  </button>
                                </div>
                              </div>
                              {selectedAssignment?._id === a._id && (
                                <div className="td-subpanel">
                                  {subsLoading && <div style={{ color: '#9aa6d1' }}>Loading submissions…</div>}
                                  {!subsLoading && subsError && <div className="alert alert--error">{subsError}</div>}
                                  {!subsLoading && !subsError && (
                                    submissions.length === 0 ? (
                                      <div className="td__empty">No submissions yet.</div>
                                    ) : (
                                      <div className="td-list td-list--compact">
                                        {submissions.map((s) => (
                                          <div key={s._id} className="td-list-item">
                                            <div className="td-list-item__left">
                                              <div className="user-chip__avatar" style={{ width: 26, height: 26 }}>{(s.student?.name || 'S').slice(0,1).toUpperCase()}</div>
                                              <div>
                                                <div className="td-list-item__title">{s.student?.name || 'Student'}</div>
                                                <div className="td-list-item__meta">{s.student?.email}</div>
                                              </div>
                                            </div>
                                            <div className="td-list-item__right">Score: {s.score ?? '—'} • {new Date(s.submittedAt).toLocaleString()}</div>
                                          </div>
                                        ))}
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <AddAssignmentModal
        open={showAddAssignment}
        onClose={() => setShowAddAssignment(false)}
        courseId={selectedCourse?._id}
        token={token}
        onCreated={() => { setShowAddAssignment(false); setActiveTab('assignments'); setAssignmentsRefresh(v=>v+1) }}
      />
    </section>
  )
}
