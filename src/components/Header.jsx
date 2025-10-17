export default function Header({ onSignUp, onLogin, user, onLogout, onGoDashboard, onGoHome, view }) {
  const role = (user?.role || '').toLowerCase()
  const isTeacher = role === 'teacher'
  const isStudent = role === 'student'
  return (
    <header className="header">
      <div className="container header__bar">
        <button className="brand" onClick={() => onGoHome && onGoHome()} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }} aria-label="Go Home">
          <span className="brand__logo">🎓</span>
          <span className="brand__name">EduPro</span>
        </button>
        <nav className="nav">
          {(view === 'teacher' || view === 'student') && (
            <button className="btn btn--ghost" onClick={() => onGoHome && onGoHome()}>Home</button>
          )}
          {isTeacher && (
            <button className="btn btn--secondary" onClick={() => onGoDashboard && onGoDashboard('teacher')}>Teacher Dashboard</button>
          )}
          {isStudent && (
            <button className="btn btn--secondary" onClick={() => onGoDashboard && onGoDashboard('student')}>Student Dashboard</button>
          )}
          {user ? (
            <>
              <div className="user-chip" title={user?.name || user?.username}>
                <span className="user-chip__avatar">{(user?.name || 'U').slice(0,1).toUpperCase()}</span>
                <span className="user-chip__name">{user?.name || 'User'}</span>
              </div>
              <button className="btn btn--ghost" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn btn--ghost" onClick={() => onLogin && onLogin()}>Login</button>
              <button onClick={() => onSignUp && onSignUp()} className="btn btn--primary">Sign Up</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
