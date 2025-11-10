import { useApp } from '../context/AppContext'
import ProjectCard from '../components/ProjectCard'

const Dashboard = () => {
  const { levels, currentUser, completedProjects } = useApp()
  const sortedLevels = [...levels].sort((a, b) => a.order - b.order)
  const completedLevelIds = new Set(completedProjects.map((p) => p.levelId))

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {currentUser?.username}!
          </h1>
          <p className="text-gray-600">Explore and complete your projects</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Available Projects</h2>
              {sortedLevels.length === 0 ? (
                <p className="text-gray-600">No projects available</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {sortedLevels.map((level) => (
                    <ProjectCard
                      key={level.id}
                      level={level}
                      isCompleted={completedLevelIds.has(level.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Projects Completed</span>
                    <span className="text-sm font-semibold text-primary-600">
                      {completedProjects.length} / {levels.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${(completedProjects.length / Math.max(levels.length, 1)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Activity</h4>
                  {completedProjects.length > 0 ? (
                    <ul className="space-y-2">
                      {completedProjects.slice(-3).reverse().map((project) => (
                        <li key={project.id} className="text-sm text-gray-600">
                          ✓ {project.levelTitle}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No completed projects yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard


