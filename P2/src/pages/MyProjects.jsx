import { useApp } from '../context/AppContext'
import { Link } from 'react-router-dom'

const MyProjects = () => {
  const { completedProjects } = useApp()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Completed Projects</h1>

        {completedProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">You haven't completed any projects yet.</p>
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Browse Projects
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{project.levelTitle}</h3>
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    Completed
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Completed on: {new Date(project.completedAt).toLocaleDateString()}
                </p>
                {project.conclusion && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Conclusion:</p>
                    <p className="text-sm text-gray-600 line-clamp-3">{project.conclusion}</p>
                  </div>
                )}
                <Link
                  to={`/level/${project.levelId}`}
                  className="text-primary-600 hover:underline text-sm font-medium"
                >
                  View Project →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyProjects

