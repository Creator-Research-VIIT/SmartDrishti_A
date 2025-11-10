import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const AdminDashboard = () => {
  const { levels, users, completedProjects } = useApp()
  const studentCount = users.filter((u) => u.role === 'student').length
  const adminCount = users.filter((u) => u.role === 'admin').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-primary-600 mb-2">{levels.length}</div>
            <div className="text-gray-600">Total Levels</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-primary-600 mb-2">{studentCount}</div>
            <div className="text-gray-600">Students</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-primary-600 mb-2">{adminCount}</div>
            <div className="text-gray-600">Admins</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {completedProjects.length}
            </div>
            <div className="text-gray-600">Completed Projects</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admin/levels"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Manage Levels</h3>
            <p className="text-gray-600">Create, edit, and organize project levels</p>
          </Link>
          <Link
            to="/admin/users"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
            <p className="text-gray-600">Add admins, manage user accounts</p>
          </Link>
          <Link
            to="/admin/profile"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold mb-2">Admin Profile</h3>
            <p className="text-gray-600">Change password and settings</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard


