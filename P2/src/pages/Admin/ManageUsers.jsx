import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const ManageUsers = () => {
  const { users, addAdmin, deleteUser, updatePassword } = useApp()
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleAddAdmin = (e) => {
    e.preventDefault()
    setError('')

    if (users.some((u) => u.username === formData.username)) {
      setError('Username already exists')
      return
    }

    if (users.some((u) => u.email === formData.email)) {
      setError('Email already exists')
      return
    }

    addAdmin({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    })

    setFormData({ username: '', email: '', password: '' })
    setShowAddAdmin(false)
  }

  const handleResetPassword = (userId) => {
    const newPassword = prompt('Enter new password for this user:')
    if (newPassword && newPassword.length >= 6) {
      updatePassword(userId, newPassword)
      alert('Password reset successfully')
    } else if (newPassword) {
      alert('Password must be at least 6 characters')
    }
  }

  const handleDeleteUser = (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      deleteUser(userId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <button
            onClick={() => setShowAddAdmin(true)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Add Admin
          </button>
        </div>

        {showAddAdmin && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Admin</h2>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Add Admin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAdmin(false)
                    setFormData({ username: '', email: '', password: '' })
                    setError('')
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleResetPassword(user.id)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Reset Password
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id, user.username)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageUsers


