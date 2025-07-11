import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const WarehouseUtilizationChart = () => {
  const [inventory, setInventory] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [totalWarehouses, setTotalWarehouses] = useState(0);
  const [sumStock, setSumStock] = useState(0);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE}/api/inventory`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((res) => {
        const data = res.data;
        setInventory(data);

        const uniqueWarehouses = [
          ...new Set(data.map((item) => item.warehouseLocation))
        ];
        setWarehouseOptions(uniqueWarehouses);
        setTotalWarehouses(uniqueWarehouses.length);

        // Compute total stock from all warehouses
        const totalStockAcrossAll = data.reduce(
          (sum, item) => sum + item.currentStock,
          0
        );
        setSumStock(totalStockAcrossAll);
      })
      .catch((err) => {
        console.error('Error fetching inventory:', err);
      });
  }, []);

  const filtered = selectedWarehouse
    ? inventory.filter((i) => i.warehouseLocation === selectedWarehouse)
    : inventory;

  const totalStock = filtered.reduce(
    (sum, item) => sum + item.currentStock,
    0
  );
  const totalCapacity = filtered.reduce(
    (sum, item) => sum + item.maxCapacity,
    0
  );
  const utilization = totalCapacity
    ? (totalStock / totalCapacity) * 100
    : 0;

  const chartData = {
    labels: ['Used Capacity', 'Free Capacity'],
    datasets: [
      {
        label: 'Utilization',
        data: [utilization, 100 - utilization],
        backgroundColor: ['#3b82f6', '#e5e7eb'],
        borderColor: ['#3b82f6', '#e5e7eb'],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="bg-white p-4 shadow rounded-md w-full max-w-md mt-6">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">
      🏭 Warehouse Utilization
      </h2>

      {/* Warehouse Selector */}
      <div className="mb-4">
        <select
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
          value={selectedWarehouse}
          onChange={(e) => setSelectedWarehouse(e.target.value)}
        >
          <option value="">All Warehouses</option>
          {warehouseOptions.map((w, i) => (
            <option key={i} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="text-center text-sm text-gray-600 mb-4">
        Total Warehouses: <strong>{totalWarehouses}</strong> | Total Stock: <strong>{sumStock}</strong>
      </div>

      {/* Pie Chart */}
      <div className="max-w-xs sm:max-w-sm md:max-w-md">
        <Pie data={chartData} options={{
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.label}: ${ctx.parsed.toFixed(1)}%`
              }
            },
            legend: {
              position: 'bottom'
            }
          }
        }} />
      </div>
    </div>
  );
};

export default WarehouseUtilizationChart;









