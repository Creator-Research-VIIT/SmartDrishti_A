import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to SmartDrishti
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Explore, learn, and complete interactive projects with real-time data visualization
            and comprehensive project management tools.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/signup"
              className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-lg"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="px-8 py-3 bg-white text-primary-600 border-2 border-primary-500 rounded-lg hover:bg-primary-50 transition-colors font-medium text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Real-time Data</h3>
            <p className="text-gray-600">
              Monitor and visualize data with interactive charts and graphs.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Project Management</h3>
            <p className="text-gray-600">
              Track your progress and complete projects with detailed reports.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Learn & Explore</h3>
            <p className="text-gray-600">
              Access comprehensive project guides and resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing