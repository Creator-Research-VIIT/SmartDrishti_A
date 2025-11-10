import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const PieChart = ({ title, data }) => {
  const chartData = {
    labels: data?.labels || ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
    datasets: data?.datasets || [
      {
        label: 'Values',
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          'rgba(249, 115, 22, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgb(249, 115, 22)',
          'rgb(59, 130, 246)',
          'rgb(234, 179, 8)',
          'rgb(34, 197, 94)',
          'rgb(168, 85, 247)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: !!title,
        text: title,
      },
    },
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>}
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  )
}

export default PieChart


