import React, { useState } from 'react';
import axios from 'axios';

const AddWarehouseForm = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({ id: '', location: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

const handleSubmit = (e) => {
  e.preventDefault();
  if (!form.id || !form.location) {
    setError('Both fields are required.');
    return;
  }

  axios
    .post('${process.env.REACT_APP_API_BASE}/api/add-warehouse', form, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      onSuccess();
      onClose();
    })
    .catch(() => {
      setError('Warehouse already exists or there was an error.');
    });
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm mx-2">
        <h2 className="text-xl font-semibold mb-4">🏭 Add New Warehouse</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="id"
            value={form.id}
            onChange={handleChange}
            placeholder="Warehouse ID"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex justify-end gap-2">
            <button onClick={onClose} type="button" className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWarehouseForm;
