import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const InventoryChart = ({ data }) => {
  const labels = data.map(item => `${item.productName} (${item.warehouseLocation})`);
  const stockData = data.map(item => item.currentStock);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Current Stock',
        data: stockData,
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // Tailwind's blue-500
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        onClick: null // 🔒 Disable legend click
      }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px] h-[300px] md:h-[400px] my-6">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default InventoryChart;
