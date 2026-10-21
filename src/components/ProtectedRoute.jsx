
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
    return <Navigate to="/student" replace />
  }

  return children
}
