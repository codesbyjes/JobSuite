
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (fullName.trim().length < 2) {
      setError('Please enter your full name.')
      return
    }

    if (password.length < 8) {
      setError('Your password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const { data, error: signUpError } = await signUp({
        fullName,
        email: email.trim(),
        password,
      })

      if (signUpError) throw signUpError

      if (data.session) {
        navigate('/student')
      } else {
        setMessage(
          'Account created! Check your email for a verification link before signing in.'
        )
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-brand">
          JobSuite
        </Link>

        <h1>Create your account</h1>
        <p>Showcase your skills. Discover your next opportunity.</p>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="auth-success" role="status">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          
<label htmlFor="password">Password</label>
<div className="password-field">
  <input
    id="password"
    type={showPassword ? 'text' : 'password'}
    autoComplete="new-password"
    minLength={8}
    value={password}
    onChange={(event) => setPassword(event.target.value)}
    required
  />
  <button
    type="button"
    className="password-toggle"
    onClick={() => setShowPassword(!showPassword)}
    aria-label={showPassword ? 'Hide password' : 'Show password'}
  >
    {showPassword ? 'Hide' : 'Show'}
  </button>
</div>


        
<label htmlFor="confirmPassword">Confirm password</label>
<div className="password-field">
  <input
    id="confirmPassword"
    type={showConfirmPassword ? 'text' : 'password'}
    autoComplete="new-password"
    minLength={8}
    value={confirmPassword}
    onChange={(event) => setConfirmPassword(event.target.value)}
    required
  />
  <button
    type="button"
    className="password-toggle"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
  >
    {showConfirmPassword ? 'Hide' : 'Show'}
  </button>
</div>


          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  )
}
