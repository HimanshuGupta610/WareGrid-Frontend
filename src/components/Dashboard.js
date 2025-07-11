import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TrendAlerts from '../components/TrendAlerts';
import InventoryChart from '../components/InventoryChart';
import DailyTrendChart from '../components/DailyTrendChart';
import WarehouseUtilizationChart from '../components/WarehouseUtilizationChart';
import StockForecastChart from './StockForecastChart'; 

const Dashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE}/api/inventory`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setInventory(res.data);
        setData(res.data);           // ✅ Fix
        
      } catch (err) {
        console.error("📛 Failed to load inventory:", err);
      }
    };

    fetchInventory();
  }, []);

    useEffect(() => {
      const query = search.toLowerCase();
      const results = data.filter(item => {
        const matchesSearch = (
          item.productName.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.warehouseLocation.toLowerCase().includes(query)
        );
        const matchesWarehouse = warehouseFilter
          ? item.warehouseLocation === warehouseFilter
          : true;
        const matchesCategory = categoryFilter.length > 0
          ? categoryFilter.includes(item.category)
          : true;
        return matchesSearch && matchesWarehouse && matchesCategory;
      });
      setFiltered(results);
    }, [search, warehouseFilter, categoryFilter, data]);
  
    const uniqueWarehouses = [...new Set(data.map(item => item.warehouseLocation))];
    

  
    return (
  <div className="min-h-screen bg-gray-100 p-4">
    <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-300 max-w-full mx-auto">
      
      {/* 🔍 Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        <select
          value={warehouseFilter}
          onChange={(e) => setWarehouseFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="">All Warehouses</option>
          {uniqueWarehouses.map((w, i) => (
            <option key={i} value={w}>{w}</option>
          ))}
        </select>
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") setCategoryFilter([]);
            else setCategoryFilter([val]);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="">All Categories</option>
          {[...new Set(data.map(item => item.category))].map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 📊 Inventory Bar Chart */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-2">📊 Inventory Chart</h2>
        <InventoryChart data={filtered} />
      </div>

      <div className="mb-8">
          <TrendAlerts products={inventory} />
        </div>

      {/* 📈 Daily Stock Trends */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-2">📉 Daily Stock Trends</h2>
        <DailyTrendChart products={filtered} />
      </div>      

      <StockForecastChart products={filtered} />  

      {/* 🧭 Warehouse Utilization */}
    <div className="flex justify-center  mb-8">
      <div className="w-full max-w-md">        
        <WarehouseUtilizationChart />
      </div>
    </div>


    </div>
  </div>
);


};

export default Dashboard;
