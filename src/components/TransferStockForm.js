import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransferStockForm = () => {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [fromWarehouse, setFromWarehouse] = useState('');
  const [toWarehouse, setToWarehouse] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');

  // 🔃 Fetch products and warehouses
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE}/api/inventory`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      setProducts(res.data);
    });

    axios.get(`${process.env.REACT_APP_API_BASE}/api/warehouses`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      setWarehouses(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!selectedProduct || !fromWarehouse || !toWarehouse || !quantity) {
      setMessage('⚠️ All fields are required.');
      return;
    }

    if (fromWarehouse === toWarehouse) {
      setMessage('⚠️ Source and destination cannot be the same.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE}/api/transfer-stock`, {
        productId: selectedProduct,
        fromWarehouseId: fromWarehouse,
        toWarehouseId: toWarehouse,
        quantity: parseInt(quantity),
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setMessage('✅ Stock transferred successfully!');
      setQuantity('');
    } catch (err) {
      setMessage('❌ Transfer failed. ' + (err.response?.data?.error || ''));
      console.error(err);
    }
  };

  // Get unique products (by ID + name)
  const uniqueProducts = Array.from(
    new Map(products.map(p => [p.productId, p])).values()
  );

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
      <h2 className="text-xl font-semibold mb-4">🔄 Transfer Stock</h2>

      {message && (
        <div className="mb-4 text-sm text-gray-800 bg-gray-100 p-3 rounded shadow">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Product</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded shadow-sm"
          >
            <option value="">Select product</option>
            {uniqueProducts.map(p => (
              <option key={p.productId} value={p.productId}>
                {p.productName} ({p.category})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">From Warehouse</label>
            <select
              value={fromWarehouse}
              onChange={(e) => setFromWarehouse(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded shadow-sm"
            >
              <option value="">Select source</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.location}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">To Warehouse</label>
            <select
              value={toWarehouse}
              onChange={(e) => setToWarehouse(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded shadow-sm"
            >
              <option value="">Select destination</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.location}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            className="w-full mt-1 px-3 py-2 border rounded shadow-sm"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Transfer Stock
        </button>
      </form>
    </div>
  );
};

export default TransferStockForm;
