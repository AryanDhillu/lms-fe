import { useEffect, useState } from 'react'
import { getCourses, getCourseStudents } from '../api'
import AddAssignmentModal from './AddAssignmentModal'

export default function TeacherDashboard({ onAddCourse, user, refreshSignal, token }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [myCourses, setMyCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [studentsError, setStudentsError] = useState(null)
  const [students, setStudents] = useState([])
  const [showAddAssignment, setShowAddAssignment] = useState(false)

  const teacherId = user?._id || user?.id

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

  // Fetch enrolled students when a course is selected
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

  return (
    <section className="container" style={{ padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 className="section__title" style={{ margin: 0, textAlign: 'left' }}>Teacher Dashboard</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {selectedCourse && (
            <button className="btn btn--ghost" onClick={() => setSelectedCourse(null)}>Back</button>
          )}
          <button className="btn btn--primary" onClick={onAddCourse}>Add Course</button>
        </div>
      </div>
      <p className="section__subtitle" style={{ textAlign: 'left' }}>Create new courses and manage your content.</p>

      {loading && (
        <div className="courses__grid">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="course skeleton"><div className="course__media" /></div>
          ))}
        </div>
      )}
      {!loading && error && (
        <div style={{ color: '#ffb4b4' }}>Error: {error}</div>
      )}
      {!loading && !error && (
        <>
          <h3 style={{ margin: '18px 0 10px' }}>My Courses</h3>
          {myCourses.length === 0 ? (
            <div style={{ color: '#9aa6d1' }}>You have not created any courses yet.</div>
          ) : (
            <div className="courses__grid">
              {myCourses.map((c) => {
                const isSelected = selectedCourse?._id === c._id
                if (selectedCourse && !isSelected) return null
                return (
                  <div key={c._id} className="course" onClick={() => !isSelected && setSelectedCourse(c)} style={{ cursor: isSelected ? 'default' : 'pointer', gridColumn: isSelected ? '1 / -1' : undefined }}>
                    <div className="course__media" />
                    <div className="course__badges">
                      <span className="badge">My Course</span>
                      {isSelected && <span className="badge" style={{ background: '#3b82f6' }}>Selected</span>}
                    </div>
                    <h3 className="course__title">{c.title}</h3>
                    <p className="course__desc">{c.description}</p>
                    <div className="course__meta">
                      <div className="course__avatar">📘</div>
                      <div className="course__instructor">
                        <div className="course__time">{c.duration}</div>
                      </div>
                    </div>
                    <div className="course__footer">
                      <div className="course__rating">⭐ {c.rating || 0}</div>
                      <div className="course__price">{c.price === 0 ? 'Free' : `$${c.price}`}</div>
                    </div>

                    {isSelected && (
                      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn--secondary" onClick={(e)=>{ e.stopPropagation(); setShowAddAssignment(true) }}>Add Assignment</button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Inline enrolled students section */}
          {selectedCourse && (
          <div style={{ marginTop: 24 }}>
            <h3 style={{ margin: '18px 0 10px' }}>Enrolled Students{selectedCourse ? ` — ${selectedCourse.title}` : ''}</h3>
              <div className="form" style={{ paddingTop: 6 }}>
                {studentsLoading && <div style={{ color: '#9aa6d1' }}>Loading…</div>}
                {!studentsLoading && studentsError && <div className="alert alert--error">{studentsError}</div>}
                {!studentsLoading && !studentsError && (
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
          )}
        </>
      )}

      <AddAssignmentModal
        open={showAddAssignment}
        onClose={() => setShowAddAssignment(false)}
        courseId={selectedCourse?._id}
        token={token}
        onCreated={() => setShowAddAssignment(false)}
      />
    </section>
  )
}
