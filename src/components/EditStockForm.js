import React, { useState } from 'react';
import axios from 'axios';

const EditStockForm = ({ product, onUpdate, onClose }) => {
  const [stock, setStock] = useState(product.currentStock);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE}/api/update-stock`,
        {
          productId: product.productId,
          warehouseId: product.warehouseId,
          currentStock: parseInt(stock),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      onUpdate({ ...product, currentStock: parseInt(stock) });
      onClose();
    } catch (err) {
      console.error("❌ Error updating stock:", err.response?.data || err.message);
      alert("Failed to update stock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800">✏️ Edit Stock</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Product:</label>
          <div className="font-medium text-gray-900">{product.productName}</div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">New Stock:</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            min="0"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStockForm;
