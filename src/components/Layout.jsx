
import { useEffect } from 'react'
import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import Toast from './Toast.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const NAV = {
  student: [
    ['/student', 'Overview'],
    ['/student/submit', 'Submit project'],
    ['/student/skills', 'Skills & verification'],
    ['/student/opportunities', 'Opportunities'],
  ],
  recruiter: [
    ['/recruiter', 'Overview'],
    ['/recruiter/talent', 'Talent discovery'],
    ['/recruiter/locations', 'Location analytics'],
    ['/recruiter/jobs', 'Job listings'],
    ['/recruiter/shortlisted', 'Shortlisted'],
  ],
}

export default function Layout({ mode }) {
  const { shortlist, resetDemo } = useApp()
  const { user, signOut } = useAuth()
  const location = useLocation()
  const nav = useNavigate()

  useEffect(() => {
    document.body.classList.remove('rec', 'student', 'auth')
    document.body.classList.add(mode === 'recruiter' ? 'rec' : 'student')

    return () => {
      document.body.classList.remove('rec', 'student', 'auth')
    }
  }, [mode])

  const other = mode === 'student' ? 'recruiter' : 'student'

  const handleLogout = async () => {
    const { error } = await signOut()

    if (error) {
      console.error('Logout failed:', error.message)
      window.alert('Could not log out. Please try again.')
      return
    }

    nav('/login', { replace: true })
  }

  return (
    <div className={`shell shell-${mode}`}>
      <nav className="side" aria-label="Main">
        <div className="logo">JobSuite</div>

        {NAV[mode].map(([to, label]) => (
          <NavLink key={to} to={to} end>
            {label}
            {label === 'Shortlisted'
              ? ` (${Object.keys(shortlist).length})`
              : ''}
          </NavLink>
        ))}

        <button
          type="button"
          className="nav-demo"
          onClick={() => nav('/' + other)}
        >
          Switch to {other} demo
        </button>

        <Link to="/">
          <button type="button">Welcome screen</button>
        </Link>

        <button type="button" onClick={resetDemo}>Reset demo data</button>

        <div className="nav-account">
          {user?.email && (
            <div className="nav-user">
              Signed in as
              <br />
              {user.email}
            </div>
          )}

          <button type="button" className="nav-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </nav>

      <main>
        <div className="route-content" key={location.pathname}>
          <Outlet />
        </div>
      </main>

      <Toast />
    </div>
  )
}
