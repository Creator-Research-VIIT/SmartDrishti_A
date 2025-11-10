const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About SmartDrishti</h1>
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <p className="text-lg text-gray-700">
              SmartDrishti is a comprehensive platform designed to help
              students learn and complete interactive projects with real-time data
              visualization and project management tools.
            </p>
            <p className="text-gray-600">
              Our platform provides students with access to various projects, each with
              detailed instructions, interactive components, and the ability to track
              their progress. Students can complete projects, generate reports, and
              visualize data using advanced charting tools.
            </p>
            <p className="text-gray-600">
              Administrators can create and manage projects, configure interactive blocks,
              and oversee student progress. The platform supports multiple project types,
              from simple monitoring systems to complex data visualization dashboards.
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Interactive project pages with customizable blocks</li>
              <li>Real-time data visualization with Chart.js</li>
              <li>Project completion tracking and reporting</li>
              <li>PDF report generation with screenshots</li>
              <li>Admin dashboard for project and user management</li>
              <li>Responsive design for all devices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About