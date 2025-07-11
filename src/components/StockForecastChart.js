import React, { useState, useMemo } from 'react';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StockForecastChart = ({ products }) => {
  

  const labels = products.map(p => `${p.productName} (${p.warehouseLocation})`);

  const data = {
    labels,
    datasets: [
      {
        label: 'Current Stock',
        data: products.map(p => p.currentStock),
        backgroundColor: '#60A5FA'
      },
      {
        label: 'Expected Demand',
        data: products.map(p => p.expectedDemand),
        backgroundColor: '#F59E0B'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },      
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}`
        }
      }
    },
    layout: { padding: { bottom: 40 } },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: false,
          callback: function (val, index) {
            const label = this.getLabelForValue(this.getLabels()[val]);
            return label.length > 15 ? label.slice(0, 15) + '…' : label;
          }
        }
      },
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Stock Forecast</h2>    

      {/* Chart container with scroll */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[1000px] h-[500px]">
          <Bar options={options} data={data} />
        </div>
      </div>
    </div>
  );
};

export default StockForecastChart;
