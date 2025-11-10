const TankGauge = ({ value = 50, min = 0, max = 100, variable = 'water_level', timestamp }) => {
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100)
  
  // Format time for clean display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800">Tank Level</h3>
        {timestamp && (
          <span className="text-xs text-gray-500">{formatTime(new Date(timestamp))}</span>
        )}
      </div>
      <div className="flex items-center justify-center mt-4">
        <div className="relative w-32 h-64 border-4 border-gray-300 rounded-b-lg overflow-hidden bg-gray-100">
          <div
            className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-300 transition-all duration-500"
            style={{ height: `${percentage}%` }}
          >
            <div className="absolute inset-0 flex items-end justify-center pb-2">
              <span className="text-white font-bold text-sm">{percentage.toFixed(1)}%</span>
            </div>
          </div>
          <div className="absolute top-2 left-2 right-2 text-xs text-gray-600 font-medium">
            {max}
          </div>
          <div className="absolute bottom-2 left-2 right-2 text-xs text-gray-600 font-medium text-center">
            {min}
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {variable}: <span className="font-semibold">{value}</span>
        </p>
        {timestamp && (
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {formatTime(new Date(timestamp))}
          </p>
        )}
      </div>
    </div>
  )
}

export default TankGauge