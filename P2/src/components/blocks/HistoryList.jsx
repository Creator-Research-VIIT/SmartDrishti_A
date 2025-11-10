const HistoryList = ({ title = 'History', entries = [], maxEntries = 10, variable = 'value', onClearHistory }) => {
  const displayEntries = entries.slice(0, maxEntries)

  // Generate mock data only if no entries are provided at all
  const shouldShowMock = entries.length === 0
  const mockEntries = shouldShowMock
    ? Array.from({ length: Math.min(maxEntries, 5) }, (_, i) => ({
        id: i + 1,
        value: Math.floor(Math.random() * 100),
        timestamp: new Date(Date.now() - (4-i) * 15000), // Every 15 seconds
      }))
    : [...displayEntries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by newest first

  // Format time for clean display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {onClearHistory && entries.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded transition-colors"
          >
            Clear History
          </button>
        )}
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {mockEntries.map((entry, index) => (
          <div
            key={entry.id || index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {variable}: <span className="text-primary-600">{entry.value || entry[variable]}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {entry.timestamp ? formatTime(new Date(entry.timestamp)) : '--:--:--'}
              </p>
            </div>
          </div>
        ))}
        {mockEntries.length === 0 && !shouldShowMock && (
          <p className="text-sm text-gray-500 text-center py-4">No history available</p>
        )}
      </div>
    </div>
  )
}

export default HistoryList