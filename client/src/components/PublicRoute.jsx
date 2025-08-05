import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

/**
 * Public Route Component
 * 
 * Redirects authenticated users away from public-only pages (login/register)
 * Allows unauthenticated users to access these pages
 * 
 * @component
 * @param {React.ReactNode} children - The component to render for unauthenticated users
 * @returns {React.ReactElement} Either the children or a redirect
 */
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  // Show loading while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If user is authenticated, redirect to tests page
  if (user) {
    return <Navigate to="/tests" replace />
  }

  // If user is not authenticated, show the requested page
  return children
}

export default PublicRoute
