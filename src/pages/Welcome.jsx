
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
      <div className="hero-inner page-enter">
        <div className="logo hero-logo">
          JobSuite
        </div>

        {!user && (
          <div className="hero-actions">
            <button className="btn" onClick={() => nav('/login')}>
              Sign In
            </button>
            <button
              className="btn btn-ok"
              onClick={() => nav('/register')}
            >
              Get Started / Register
            </button>
          </div>
        )}

        {showWarning && !user && (
          <div className="hero-alert" role="alert">
            <strong>Please sign in or create an account first.</strong>
            <div>
              To continue,{' '}
              <button
                type="button"
                className="linkish"
                onClick={() => nav('/login')}
              >
                Sign In
              </button>
              {' '}or{' '}
              <button
                type="button"
                className="linkish"
                onClick={() => nav('/register')}
              >
                Create an Account
              </button>.
            </div>
          </div>
        )}

        <h1>Real Skills. Equal Opportunities.</h1>

        <p className="mu hero-lead">
          An AI-powered hiring platform that helps fresh talent get
          recognised for what they can actually do — not just where
          they studied.
        </p>

        <div className="grid g2 stagger" style={{ marginBottom: 24 }}>
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
            <span className="btn btn-ok">
              Explore Talent
            </span>
          </button>
        </div>

        <p className="mu hero-foot">
          Build — submit your projects. Verify — prove your skills.
          Get discovered — connect with opportunities.
        </p>

        <p className="mu sm hero-foot">
          Prototype: some features may still use simulated browser data.
        </p>
      </div>
    </div>
  )
}
