import { Link } from 'react-router-dom'

const ProjectCard = ({ level, isCompleted = false }) => {
  const difficultyColors = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800',
  }

  return (
    <Link
      to={`/level/${level.id}`}
      className="block transform hover:scale-105 transition-transform duration-200"
    >
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800">{level.title}</h3>
          {isCompleted && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
              Completed
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {level.description}
        </p>
        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              difficultyColors[level.difficulty] || difficultyColors.Beginner
            }`}
          >
            {level.difficulty}
          </span>
          <span className="text-sm text-gray-500">Level {level.level}</span>
        </div>
      </div>
    </Link>
  )
}

export default ProjectCard


