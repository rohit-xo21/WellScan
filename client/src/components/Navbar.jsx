import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
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
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm text-gray-600">
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
              <div className="hidden md:flex items-center space-x-3">
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

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-6 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <Link
              to="/"
              onClick={closeMenu}
              className="block text-gray-600 font-medium hover:text-blue-600 transition-colors duration-300 py-2"
            >
              HOME
            </Link>
            <Link
              to="/tests"
              onClick={closeMenu}
              className="block text-gray-600 font-medium hover:text-blue-600 transition-colors duration-300 py-2"
            >
              ALL TESTS
            </Link>
            <Link
              to="/bookings"
              onClick={closeMenu}
              className="block text-gray-600 font-medium hover:text-blue-600 transition-colors duration-300 py-2"
            >
              BOOKINGS
            </Link>

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-100">
              {user ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Welcome, {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="block text-center text-gray-600 font-medium hover:text-blue-600 transition-colors duration-300 py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-300 text-center"
                  >
                    Create account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
