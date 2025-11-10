import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import Landing from './pages/Landing'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import MyProjects from './pages/MyProjects'
import LevelPage from './pages/LevelPage'

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard'
import ManageLevels from './pages/Admin/ManageLevels'
import LevelEditor from './pages/Admin/LevelEditor'
import ManageUsers from './pages/Admin/ManageUsers'
import AdminProfile from './pages/Admin/AdminProfile'

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser } = useApp()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Student Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-projects"
              element={
                <ProtectedRoute>
                  <MyProjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/level/:id"
              element={
                <ProtectedRoute>
                  <LevelPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/levels"
              element={
                <ProtectedRoute requireAdmin>
                  <ManageLevels />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/levels/new"
              element={
                <ProtectedRoute requireAdmin>
                  <LevelEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/levels/:id"
              element={
                <ProtectedRoute requireAdmin>
                  <LevelEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminProfile />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App


