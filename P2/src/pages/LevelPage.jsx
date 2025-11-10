import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import axios from 'axios'

// Block components
import TankGauge from '../components/blocks/TankGauge'
import SimpleLineChart from '../components/blocks/SimpleLineChart'
import BarChart from '../components/blocks/BarChart'
import PieChart from '../components/blocks/PieChart'
import HistoryList from '../components/blocks/HistoryList'

const LevelPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { levels, currentUser, completeProject, updateLevel } = useApp()
  const [level, setLevel] = useState(null)
  const [apiFields, setApiFields] = useState({})
  const [apiResponse, setApiResponse] = useState(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [conclusion, setConclusion] = useState('')
  const [useDefaultConclusion, setUseDefaultConclusion] = useState(false)
  const [variableValues, setVariableValues] = useState({})
  const [historyData, setHistoryData] = useState({}) // State to manage history data
  const levelRef = useRef(null)

  useEffect(() => {
    const foundLevel = levels.find((l) => l.id === parseInt(id))
    if (foundLevel) {
      setLevel(foundLevel)
      // Initialize API fields
      const apiBlock = foundLevel.blocks.find((b) => b.type === 'api')
      if (apiBlock) {
        const initialFields = {}
        apiBlock.fields.forEach((field) => {
          initialFields[field.key] = field.value || ''
        })
        setApiFields(initialFields)
      }
      // Initialize variable values for custom blocks
      const initialVars = {}
      const initialHistory = {}
      foundLevel.blocks.forEach((block) => {
        if (block.type === 'custom-block' && block.config?.variable) {
          initialVars[block.config.variable] = block.config.min || 0
        }
        if (block.type === 'entry' && block.config?.variable) {
          initialVars[block.config.variable] = ''
        }
        // Initialize history data for history blocks
        if (block.type === 'history' && block.config?.variable) {
          // Load history from localStorage or initialize empty array
          const savedHistory = localStorage.getItem(`history_${id}_${block.config.variable}`)
          initialHistory[block.config.variable] = savedHistory ? JSON.parse(savedHistory) : []
        }
      })
      setVariableValues(initialVars)
      setHistoryData(initialHistory)
    }
  }, [id, levels])

  const handleApiFieldChange = (key, value) => {
    setApiFields({ ...apiFields, [key]: value })
  }

  const handleTestApi = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1', {
        headers: {
          'X-API-Key': apiFields.apiKey || 'test-key',
          'X-Template-ID': apiFields.templateId || 'test-template',
        },
      })
      setApiResponse({
        status: response.status,
        data: response.data,
      })
    } catch (error) {
      setApiResponse({
        status: error.response?.status || 500,
        error: error.message,
        data: error.response?.data || null,
      })
    }
  }

  const generateChartData = (block) => {
    const variables = block.config?.variables || ['value']
    
    // Use history data if available, otherwise generate mock data
    const historyEntries = historyData[variables[0]] || []
    
    if (historyEntries.length > 0) {
      // Use real history data
      const sortedEntries = [...historyEntries].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      const labels = sortedEntries.map(entry => {
        const date = new Date(entry.timestamp)
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      })
      
      const datasets = variables.map((variable, index) => {
        const colors = [
          { border: 'rgb(249, 115, 22)', bg: 'rgba(249, 115, 22, 0.1)' },
          { border: 'rgb(59, 130, 246)', bg: 'rgba(59, 130, 246, 0.1)' },
          { border: 'rgb(34, 197, 94)', bg: 'rgba(34, 197, 94, 0.1)' },
        ]
        const color = colors[index % colors.length]
        return {
          label: variable,
          data: sortedEntries.map(entry => entry.value),
          borderColor: color.border,
          backgroundColor: color.bg,
          tension: 0.4,
        }
      })
      
      return { labels, datasets }
    } else {
      // Generate mock data
      const labels = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })

      const datasets = variables.map((variable, index) => {
        const colors = [
          { border: 'rgb(249, 115, 22)', bg: 'rgba(249, 115, 22, 0.1)' },
          { border: 'rgb(59, 130, 246)', bg: 'rgba(59, 130, 246, 0.1)' },
          { border: 'rgb(34, 197, 94)', bg: 'rgba(34, 197, 94, 0.1)' },
        ]
        const color = colors[index % colors.length]
        return {
          label: variable,
          data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
          borderColor: color.border,
          backgroundColor: color.bg,
          tension: 0.4,
        }
      })

      return { labels, datasets }
    }
  }

  const handleExportPDF = async () => {
    if (!levelRef.current) return

    try {
      const canvas = await html2canvas(levelRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 10

      pdf.setFontSize(16)
      pdf.text(level.title, pdfWidth / 2, 10, { align: 'center' })
      pdf.text(`Student: ${currentUser?.username || 'Unknown'}`, pdfWidth / 2, 18, {
        align: 'center',
      })
      pdf.text(
        `Date: ${new Date().toLocaleDateString()}`,
        pdfWidth / 2,
        26,
        { align: 'center' }
      )

      pdf.addImage(imgData, 'PNG', imgX, imgY + 20, imgWidth * ratio, imgHeight * ratio)

      const defaultConclusionText =
        'This project was completed successfully with all objectives met. The data visualization and monitoring components functioned as expected.'
      const conclusionText = useDefaultConclusion
        ? defaultConclusionText
        : conclusion || defaultConclusionText

      const textY = imgY + 20 + imgHeight * ratio + 10
      pdf.setFontSize(12)
      pdf.text('Conclusion:', 10, textY)
      pdf.setFontSize(10)
      const splitText = pdf.splitTextToSize(conclusionText, pdfWidth - 20)
      pdf.text(splitText, 10, textY + 8)

      pdf.save(`${level.title}_${currentUser?.username}_${Date.now()}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  const handleComplete = () => {
    if (!useDefaultConclusion && !conclusion.trim()) {
      alert('Please enter a conclusion or select "Use default conclusion"')
      return
    }

    const defaultConclusionText =
      'This project was completed successfully with all objectives met.'
    const conclusionText = useDefaultConclusion ? defaultConclusionText : conclusion

    completeProject({
      levelId: level.id,
      levelTitle: level.title,
      studentId: currentUser?.id,
      studentName: currentUser?.username,
      conclusion: conclusionText,
    })

    setShowCompletionModal(false)
    navigate('/my-projects')
  }

  // Function to add a new history entry
  const addHistoryEntry = (variable, value) => {
    const newEntry = {
      id: Date.now(),
      value: value,
      timestamp: new Date()
    }

    setHistoryData(prev => {
      const updatedHistory = {
        ...prev,
        [variable]: [
          newEntry,
          ...(prev[variable] || [])
        ].slice(0, 50) // Keep only last 50 entries
      }
      
      // Save to localStorage
      localStorage.setItem(`history_${id}_${variable}`, JSON.stringify(updatedHistory[variable]))
      
      return updatedHistory
    })
  }

  // Function to clear all history
  const clearHistory = (variable) => {
    setHistoryData(prev => {
      const updatedHistory = {
        ...prev,
        [variable]: []
      }
      
      // Clear from localStorage
      localStorage.setItem(`history_${id}_${variable}`, JSON.stringify([]))
      
      return updatedHistory
    })
  }

  if (!level) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <p className="text-gray-600">Level not found</p>
      </div>
    )
  }

  const apiBlock = level.blocks.find((b) => b.type === 'api')
  const otherBlocks = level.blocks.filter((b) => b.type !== 'api')

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Blue Header */}
      <div className="text-white shadow-lg" style={{ background: 'linear-gradient(to right, #ff8a00, #e52e71)' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 ">{level.title}</h1>
              <p className="text-primary-100">{level.description}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCompletionModal(true)}
                className="px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
              >
                Mark Complete
              </button>
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
              >
                Download Report (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div ref={levelRef} className="space-y-6">
          {/* Main Content Grid - Matrix Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rounded-xl p-6" style={{ backgroundColor: '#f7d6ff' }}>
            {/* Render all blocks in a matrix layout */}
            {otherBlocks.map((block, index) => {
              if (block.type === 'custom-block') {
                if (block.component === 'TankGauge') {
                  // Get the latest value from history if available
                  const historyEntries = historyData[block.config?.variable] || []
                  const latestValue = historyEntries.length > 0 
                    ? historyEntries[0].value 
                    : variableValues[block.config?.variable] || 50
                  
                  return (
                    <TankGauge
                      key={index}
                      value={latestValue}
                      min={block.config?.min || 0}
                      max={block.config?.max || 100}
                      variable={block.config?.variable || 'water_level'}
                      timestamp={historyEntries.length > 0 ? historyEntries[0].timestamp : new Date()}
                    />
                  )
                }
              }

              if (block.type === 'graph') {
                const chartData = generateChartData(block)
                if (block.config?.chartType === 'bar') {
                  return (
                    <BarChart
                      key={index}
                      title={block.config?.title}
                      data={chartData}
                      xAxis={block.config?.xAxis}
                      yAxis={block.config?.yAxis}
                    />
                  )
                } else if (block.config?.chartType === 'pie') {
                  return (
                    <PieChart
                      key={index}
                      title={block.config?.title}
                      data={chartData}
                    />
                  )
                } else {
                  return (
                    <SimpleLineChart
                      key={index}
                      title={block.config?.title}
                      data={chartData}
                      xAxis={block.config?.xAxis}
                      yAxis={block.config?.yAxis}
                    />
                  )
                }
              }

              if (block.type === 'history') {
                return (
                  <HistoryList
                    key={index}
                    title={block.config?.title || 'History'}
                    maxEntries={block.config?.maxEntries || 10}
                    variable={block.config?.variable || 'value'}
                    entries={historyData[block.config?.variable] || []}
                    onClearHistory={() => clearHistory(block.config?.variable)}
                  />
                )
              }

              if (block.type === 'entry') {
                return (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      {block.config?.label || 'Set Value'}
                    </h3>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        placeholder={block.config?.placeholder || 'Enter value'}
                        value={variableValues[block.config?.variable] || ''}
                        onChange={(e) =>
                          setVariableValues({
                            ...variableValues,
                            [block.config?.variable]: e.target.value,
                          })
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => {
                          // Update variable value
                          const value = parseFloat(variableValues[block.config?.variable])
                          if (!isNaN(value)) {
                            setVariableValues({
                              ...variableValues,
                              [block.config?.variable]: value,
                            })
                            // Add to history
                            addHistoryEntry(block.config?.variable, value)
                          }
                        }}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        Set
                      </button>
                    </div>
                  </div>
                )
              }

              return null
            })}
            
            {/* API Block - now part of the grid */}
            {apiBlock && (
              <div key="api-block" className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">API Settings</h3>
                <div className="space-y-4">
                  {apiBlock.fields.map((field, idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={apiFields[field.key] || ''}
                        onChange={(e) => handleApiFieldChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        placeholder={`Enter ${field.label}`}
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleTestApi}
                    className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                  >
                    Test HTTP Data
                  </button>
                  {apiResponse && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-semibold mb-2">
                        Status: {apiResponse.status}
                      </p>
                      <pre className="text-xs overflow-auto max-h-32">
                        {JSON.stringify(apiResponse.data || apiResponse.error, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Complete Project</h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={useDefaultConclusion}
                    onChange={(e) => setUseDefaultConclusion(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Use default conclusion</span>
                </label>
              </div>
              {!useDefaultConclusion && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conclusion
                  </label>
                  <textarea
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your conclusion..."
                  />
                </div>
              )}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LevelPage
