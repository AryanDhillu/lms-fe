import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Categories from './components/Categories'
import PopularCourses from './components/PopularCourses'
import Features from './components/Features'
import CTA from './components/CTA'
import Footer from './components/Footer'
import SignupModal from './components/SignupModal'
import LoginModal from './components/LoginModal'
import TeacherDashboard from './components/TeacherDashboard'
import StudentDashboard from './components/StudentDashboard'
import AddCourseModal from './components/AddCourseModal'
import CourseModal from './components/CourseModal'
import { useEffect, useState } from 'react'

function App() {
  const [showSignup, setShowSignup] = useState(false)
  const [defaultRole, setDefaultRole] = useState('Student')
  const [showLogin, setShowLogin] = useState(false)
  const [defaultEmail, setDefaultEmail] = useState('')
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [view, setView] = useState('home') // 'home' | 'teacher' | 'student'
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [refreshSignal, setRefreshSignal] = useState(0)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('edupro:user')
    const savedToken = localStorage.getItem('edupro:token')
    if (savedUser) { try { setUser(JSON.parse(savedUser)) } catch {} }
    if (savedToken) setToken(savedToken)
  }, [])

  useEffect(() => {
    if (user) localStorage.setItem('edupro:user', JSON.stringify(user))
    else localStorage.removeItem('edupro:user')
  }, [user])

  useEffect(() => {
    if (token) localStorage.setItem('edupro:token', token)
    else localStorage.removeItem('edupro:token')
  }, [token])

  const openSignup = (role = 'Student') => { setDefaultRole(role); setShowSignup(true) }
  const openLogin = (email = '') => { setDefaultEmail(email); setShowLogin(true) }

  const onLoggedIn = (data) => {
    const inferredUser = data?.user || data?.data || data
    const name = inferredUser?.name || inferredUser?.username || 'User'
    const role = inferredUser?.role || inferredUser?.user?.role
    const id = inferredUser?._id || inferredUser?.id
    const jwt = data?.token || inferredUser?.token
    setUser({ _id: id, name, role, ...inferredUser })
    if (jwt) setToken(jwt)
  }

  const onLogout = () => { setUser(null); setToken(null); setView('home') }

  const openCourse = (course) => setSelectedCourse(course)

  return (
    <>
      <Header
        onSignUp={() => openSignup('Student')}
        onLogin={() => openLogin()}
        user={user}
        onLogout={onLogout}
        view={view}
        onGoHome={() => setView('home')}
        onGoDashboard={(target) => setView(target)}
      />

      {view === 'home' ? (
        <>
          <main>
            <Hero onSignUp={openSignup} />
            <Stats />
            <Categories selected={selectedCategory} onSelect={setSelectedCategory} />
            <PopularCourses user={user} onOpenCourse={setSelectedCourse} selectedCategory={selectedCategory} />
            <Features />
            <CTA onSignUp={openSignup} />
          </main>
          <Footer />
        </>
      ) : view === 'teacher' ? (
        <>
          <TeacherDashboard onAddCourse={() => setShowAddCourse(true)} user={user} refreshSignal={refreshSignal} token={token} />
        </>
      ) : (
        <>
          <StudentDashboard token={token} />
        </>
      )}

      <SignupModal open={showSignup} onClose={() => setShowSignup(false)} defaultRole={defaultRole} onRequestLogin={(email)=>{ setShowSignup(false); openLogin(email) }} />
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} defaultEmail={defaultEmail} onLoggedIn={(data)=>{ setShowLogin(false); onLoggedIn(data) }} />
      <AddCourseModal open={showAddCourse} onClose={() => setShowAddCourse(false)} token={token} onCreated={()=>{ setShowAddCourse(false); setRefreshSignal(v=>v+1) }} />
      <CourseModal open={!!selectedCourse} onClose={() => setSelectedCourse(null)} course={selectedCourse} user={user} token={token} onLoginRequest={() => openLogin()} />
    </>
  )
}

export default App
