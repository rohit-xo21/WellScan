import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 fixed top-0 w-full z-50" style={{ height: '70px' }}>
      <div className="max-w-7xl mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-900">WellScan</span>
          </Link>

          {/* Menu Items */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-600 font-medium hover:text-blue-600 transition-colors duration-300 border-b-2 border-transparent hover:border-blue-600 pb-1"
            >
              HOME
            </Link>
            <Link 
              to="/tests" 
              className="text-gray-600 font-medium hover:text-blue-600 transition-colors duration-300 border-b-2 border-transparent hover:border-blue-600 pb-1"
            >
              ALL TESTS
            </Link>
            <Link 
              to="/bookings" 
              className="text-gray-600 font-medium hover:text-blue-600 transition-colors duration-300 border-b-2 border-transparent hover:border-blue-600 pb-1"
            >
              BOOKINGS
            </Link>
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 hidden md:block">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 font-medium hover:text-blue-600 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors duration-300"
                >
                  Create account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
