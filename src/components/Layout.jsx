
import { useEffect } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
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
  const nav = useNavigate()

  useEffect(() => {
    document.body.className = mode === 'recruiter' ? 'rec' : ''

    return () => {
      document.body.className = ''
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
    <div className="shell">
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
          onClick={() => nav('/' + other)}
          style={{
            marginTop: 14,
            border: '1px dashed var(--bd)',
          }}
        >
          Switch to {other} demo
        </button>

        <Link to="/">
          <button>Welcome screen</button>
        </Link>

        <button onClick={resetDemo}>Reset demo data</button>

        <div
          style={{
            marginTop: 16,
            paddingTop: 12,
            borderTop: '1px solid var(--bd)',
          }}
        >
          {user?.email && (
            <div
              style={{
                padding: '8px 12px',
                fontSize: 12,
                overflowWrap: 'anywhere',
                color: 'var(--mu)',
              }}
            >
              Signed in as
              <br />
              {user.email}
            </div>
          )}

          <button
            onClick={handleLogout}
            style={{
              marginTop: 8,
              border: '1px solid var(--bd)',
              width: '100%',
            }}
          >
            Log out
          </button>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <Toast />
    </div>
  )
}
