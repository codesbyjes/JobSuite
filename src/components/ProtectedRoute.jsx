
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({
  children,
  requiredRole,
}) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div style={{ padding: 32 }}>Checking your session...</div>
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  if (!profile) {
    return (
      <div style={{ padding: 32 }}>
        We couldn't load your profile. Please refresh or sign in again.
      </div>
    )
  }

  if (requiredRole && profile.role !== requiredRole) {
    const fallbackPath =
      profile.role === 'recruiter' ? '/recruiter' : '/student'

    return <Navigate to={fallbackPath} replace />
  }

  if (
    profile.role === 'recruiter' &&
    profile.approval_status !== 'approved'
  ) {
    return (
      <main style={{ padding: 32 }}>
        <h1>Recruiter approval pending</h1>
        <p>
          Your recruiter account is awaiting approval. You cannot access
          recruiter features until an administrator approves your account.
        </p>
      </main>
    )
  }

  return children
}
