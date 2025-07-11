import React, { useState } from 'react';
import axios from 'axios';

const BulkUploadProduct = ({onUploadSuccess}) => {
  const [productFile, setProductFile] = useState(null);  
  const [status, setStatus] = useState('');

  const handleProductUpload = async () => {
    if (!productFile) return;

    const formData = new FormData();
    formData.append('file', productFile);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE}/api/upload-products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStatus(`✅ Uploaded ${res.data.added} products`);
        onUploadSuccess?.(); 
    } catch (err) {
      console.error('❌ Product upload failed:', err);
      setStatus('❌ Product upload failed');
    }
  };
  return (
    <div className="p-4 bg-white rounded shadow-md mt-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">📤 Bulk Upload (CSV)</h2>

      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-1">Upload Products CSV</label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setProductFile(e.target.files[0])}
          className="block w-full border p-2 rounded mb-2"
        />
        <button
          onClick={handleProductUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload Products
        </button>
      </div>     

      {status && <div className="text-sm text-gray-700 mt-4">{status}</div>}
    </div>
  );
};

export default BulkUploadProduct;
