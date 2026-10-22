
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Welcome() {
  const nav = useNavigate()
  const { user, loading } = useAuth()
  const [showWarning, setShowWarning] = useState(false)

  function handlePortalClick(path) {
    if (loading) return

    if (!user) {
      setShowWarning(true)
      return
    }

    setShowWarning(false)
    nav(path)
  }

  return (
    <div className="hero">
      <div style={{ maxWidth: 980 }}>
        <div
          className="logo"
          style={{ fontSize: 28, margin: '0 0 20px' }}
        >
          JobSuite
        </div>

        {!user && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 28,
          }}>
            <button className="btn" onClick={() => nav('/login')}>
              Sign In
            </button>
            <button
              className="btn"
              style={{ background: '#20E69A', color: '#07131A' }}
              onClick={() => nav('/register')}
            >
              Get Started / Register
            </button>
          </div>
        )}

        {showWarning && !user && (
          <div
            role="alert"
            style={{
              maxWidth: 600,
              margin: '0 auto 24px',
              padding: '16px 20px',
              border: '1px solid #ffb4b4',
              borderRadius: 10,
              background: '#fff0f0',
              color: '#c62828',
              lineHeight: 1.7,
            }}
          >
            <strong>Please sign in or create an account first.</strong>
            <div>
              To continue,{' '}
              <button
                onClick={() => nav('/login')}
                style={{
                  color: '#c62828',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  textDecoration: 'underline',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Sign In
              </button>
              {' '}or{' '}
              <button
                onClick={() => nav('/register')}
                style={{
                  color: '#c62828',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  textDecoration: 'underline',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Create an Account
              </button>.
            </div>
          </div>
        )}

        <h1>Real Skills. Equal Opportunities.</h1>

        <p
          className="mu"
          style={{
            fontSize: 18,
            maxWidth: 640,
            margin: '14px auto 28px',
          }}
        >
          An AI-powered hiring platform that helps fresh talent get
          recognised for what they can actually do — not just where
          they studied.
        </p>

        <div className="grid g2" style={{ marginBottom: 24 }}>
          <button
            className="card role s"
            onClick={() => handlePortalClick('/student')}
          >
            <h2 style={{ color: '#00D9FF' }}>I’m a Student</h2>
            <p className="mu">
              Showcase your projects, prove your skills, and unlock opportunities.
            </p>
            <span className="btn" style={{ background: '#2583FF' }}>
              Enter Student Portal
            </span>
          </button>

          <button
            className="card role r"
            onClick={() => handlePortalClick('/recruiter')}
          >
            <h2 style={{ color: '#20E69A' }}>I’m a Recruiter</h2>
            <p className="mu">
              Discover verified talent, explore skill matches, and hire with confidence.
            </p>
            <span
              className="btn"
              style={{ background: '#20E69A', color: '#07131A' }}
            >
              Explore Talent
            </span>
          </button>
        </div>

        <p className="mu">
          Build — submit your projects. Verify — prove your skills.
          Get discovered — connect with opportunities.
        </p>

        <p className="mu sm">
          Prototype: some features may still use simulated browser data.
        </p>
      </div>
    </div>
  )
}
