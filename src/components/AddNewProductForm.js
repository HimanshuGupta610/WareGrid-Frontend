import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddNewProductForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    productName: '', category: '', warehouseId: '', warehouseLocation: '',
    currentStock: '', minThreshold: '', maxCapacity: '', expectedDemand: ''
  });
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE}/api/warehouses`)
      .then(res => setWarehouses(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log("🔑 Token:", token); 
    const payload = {
      ...formData,
      currentStock: parseInt(formData.currentStock),
      minThreshold: parseInt(formData.minThreshold),
      maxCapacity: parseInt(formData.maxCapacity),
      expectedDemand: parseInt(formData.expectedDemand),
    };
    axios.post(`${process.env.REACT_APP_API_BASE}/api/add-product`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(() => {
        onSuccess();
        onClose();
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-2 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">➕ Add New Product</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="productName" placeholder="Product Name" value={formData.productName} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
          <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
          <select name="warehouseId" value={formData.warehouseId} onChange={(e) => {
            const id = e.target.value;
            const loc = warehouses.find(w => w.id === id)?.location || '';
            setFormData(prev => ({ ...prev, warehouseId: id, warehouseLocation: loc }));
          }} className="w-full px-3 py-2 border rounded-md" required>
            <option value="">Select Warehouse</option>
            {warehouses.map(w => <option key={w.id} value={w.id}>{w.id} - {w.location}</option>)}
          </select>
          <input name="currentStock" type="number" placeholder="Current Stock" value={formData.currentStock} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
          <input name="minThreshold" type="number" placeholder="Min Threshold" value={formData.minThreshold} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
          <input name="maxCapacity" type="number" placeholder="Max Capacity" value={formData.maxCapacity} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
          <input name="expectedDemand" type="number" placeholder="Expected Demand" value={formData.expectedDemand} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewProductForm;
