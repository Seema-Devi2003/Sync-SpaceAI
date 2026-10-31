import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Spinner } from "../components/ui/Spinner"

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900">
        <Spinner label="Checking your session" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
