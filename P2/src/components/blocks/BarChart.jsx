import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const BarChart = ({ title, data, xAxis = 'Time', yAxis = 'Value' }) => {
  const chartData = {
    labels: data?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: data?.datasets || [
      {
        label: 'Value',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(249, 115, 22, 0.8)',
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xAxis,
        },
      },
      y: {
        title: {
          display: true,
          text: yAxis,
        },
      },
    },
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>}
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}

export default BarChart


