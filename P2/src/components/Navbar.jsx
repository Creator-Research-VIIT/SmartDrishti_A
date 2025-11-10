import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import ProfileMenu from './ProfileMenu'

const Navbar = () => {
  const { currentUser, logout } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-xl font-bold hover:text-primary-100 transition-colors"
            >
              SmartDrishti
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                to="/"
                className="hover:text-primary-100 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="hover:text-primary-100 transition-colors"
              >
                About
              </Link>
              {currentUser && currentUser.role === 'student' && (
                <>
                  <Link
                    to="/dashboard"
                    className="hover:text-primary-100 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-projects"
                    className="hover:text-primary-100 transition-colors"
                  >
                    My Projects
                  </Link>
                </>
              )}
              {currentUser && currentUser.role === 'admin' && (
                <Link
                  to="/admin"
                  className="hover:text-primary-100 transition-colors"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <ProfileMenu user={currentUser} onLogout={handleLogout} />
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar