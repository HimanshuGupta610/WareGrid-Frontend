import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DailyTrendChart = ({ products }) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // includes today

  const allDates = [...new Set(
    products.flatMap(p => p.history?.map(h => h.date))
  )]
    .filter(date => new Date(date) >= sevenDaysAgo)
    .sort();

  const datasets = products.map((p, i) => ({
    label: `${p.productName} (${p.warehouseLocation})`,
    data: allDates.map(date => {
      const entry = p.history?.find(h => h.date === date);
      return entry ? entry.stock : null;
    }),
    borderColor: `hsl(${(i * 137.508) % 360}, 70%, 50%)`,
    backgroundColor: `hsla(${(i * 137.508) % 360}, 70%, 50%, 0.3)`,
    tension: 0.3,
    fill: false,
    spanGaps: true
  }));

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px] h-[300px] md:h-[400px] my-6">
        <Line
          data={{ labels: allDates, datasets }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top' }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default DailyTrendChart;
