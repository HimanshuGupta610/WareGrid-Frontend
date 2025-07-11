import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import EditStockForm from './EditStockForm';
import AddNewProductForm from './AddNewProductForm';
import AddWarehouseForm from './AddWarehouseForm';
import ConfirmDialog from './ConfirmDialog';
import { useNavigate } from 'react-router-dom';
import { isAdmin, isLoggedIn, getRole } from '../utils/auth';




const InventoryTable = () => {  
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [showWarehouseForm, setShowWarehouseForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();  
 

  if (!isLoggedIn()) {
  navigate('/login');
}

const role = getRole(); // optional use
const adminOnly = isAdmin();

  useEffect(() => {
  axios
    .get('${process.env.REACT_APP_API_BASE}/api/inventory', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((res) => {
      setData(res.data);
      setFiltered(res.data);
      setCategoryFilter([...new Set(res.data.map(item => item.category))]);
    })
    .catch((err) => {
      console.error('API error:', err.response?.data || err.message);
    });
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
  const lowStockItems = filtered.filter(item => item.currentStock < item.minThreshold);

  
 const handleStockUpdate = async (updatedProduct) => {
  try {
    // Send stock update to backend
    await axios.post('${process.env.REACT_APP_API_BASE}/api/update-stock', updatedProduct, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    // Fetch fresh data from backend to get updated history
    const res = await axios.get('${process.env.REACT_APP_API_BASE}/api/inventory', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    setData(res.data);
    setFiltered(res.data);
  } catch (err) {
    console.error("❌ Error updating stock:", err);
  }
};
  const handleDeleteProduct = async () => {
  if (!deleteTarget) return;

  try {
    await axios.delete('${process.env.REACT_APP_API_BASE}/api/delete-product', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      data: {
        productId: deleteTarget.productId,
        warehouseId: deleteTarget.warehouseId,
      },
    });

    // ✅ Update frontend state after deletion
    setData(prev =>
      prev.filter(
        p =>
          !(
            p.productId === deleteTarget.productId &&
            p.warehouseId === deleteTarget.warehouseId
          )
      )
    );
    setFiltered(prev =>
      prev.filter(
        p =>
          !(
            p.productId === deleteTarget.productId &&
            p.warehouseId === deleteTarget.warehouseId
          )
      )
    );
  } catch (err) {
    console.error('❌ Delete failed:', err.response?.data || err.message);
    alert('Error deleting product.');
  } finally {
    setDeleteTarget(null);
  }
};





  return (
    
    
    <div className="p-4 bg-white shadow-lg rounded-lg border">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">📦 Inventory Table</h2>
      


      {lowStockItems.length > 0 && (
        <div className="bg-red-100 text-red-800 p-3 mb-4 rounded-lg font-medium shadow-sm">
          ⚠️ {lowStockItems.length} product{lowStockItems.length > 1 ? 's are' : ' is'} low on stock!
        </div>
      )}
      {/* ➕ Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => setAddingNew(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          ➕ Add Product
        </button>
        {adminOnly && (
        <button
          onClick={() => setShowWarehouseForm(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          🏭 Add Warehouse
        </button>
        )}
        {adminOnly && (
        <CSVLink
          data={filtered}
          filename="inventory-export.csv"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            axios.post('${process.env.REACT_APP_API_BASE}/api/log-export', {}, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }).then(() => {
              console.log('✅ Export logged');
            }).catch(err => {
              console.error('❌ Failed to log export:', err.response?.data || err.message);
            });
          }}
        >
          ⬇️ Export CSV
        </CSVLink>
        )}  
        {adminOnly && (
       
          <button
            onClick={() => navigate('/transfer')}
            className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-all text-sm sm:text-base"
          >
            🔄 Transfer Stock
          </button>
        
      )}      
        {(
        <button
          onClick={() => navigate('/upload/products')}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          📤 Bulk Upload
        </button>
        
      )}
      
      </div>

      {/* 🔍 Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 gap-3 mb-4">
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

      

           

      {/* 📋 Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Product</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Warehouse</th>
              <th className="px-4 py-2 border w-40">Stock</th>
              <th className="px-4 py-2 border w-40">Min Threshold</th>
              <th className="px-2 py-2 border w-40 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No results found.
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr key={idx} className="even:bg-gray-50 text-gray-800">
                  <td className="px-4 py-2 border">{item.productName}</td>
                  <td className="px-4 py-2 border">{item.category}</td>
                  <td className="px-4 py-2 border">{item.warehouseLocation}</td>
                  <td className={`px-4 py-2 w-40 border font-semibold ${
                    item.currentStock < item.minThreshold ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {item.currentStock}
                  </td>
                  <td className="px-4 py-2 border w-40">{item.minThreshold}</td>
                  <td className="px-2 py-2 border w-40">
                    <div className="flex justify-center gap-10">
                      <button
                        onClick={() => setEditingProduct(item)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      {adminOnly && (
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                      )}
                    </div>
                  </td>
                  </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🧩 Modals */}
      {editingProduct && (
        <EditStockForm
          product={editingProduct}
          onUpdate={handleStockUpdate}
          onClose={() => setEditingProduct(null)}
        />
      )}
      {addingNew && (
        <AddNewProductForm
          onClose={() => setAddingNew(false)}
          onSuccess={() => {
            axios.get('${process.env.REACT_APP_API_BASE}/api/inventory').then(res => {
              setData(res.data);
              setFiltered(res.data);
            });
          }}
        />
      )}
      {showWarehouseForm && (
        <AddWarehouseForm
          onClose={() => setShowWarehouseForm(false)}
          onSuccess={() => {}}
        />
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${deleteTarget?.productName}" from ${deleteTarget?.warehouseLocation}?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteProduct}
      />
      


    </div>
    
  );
};

export default InventoryTable;
