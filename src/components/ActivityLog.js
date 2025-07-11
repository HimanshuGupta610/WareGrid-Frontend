import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE}/api/activity-log`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => {
        const sorted = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLogs(sorted);
        setFiltered(sorted);
      });
  }, []);

  useEffect(() => {
    let result = [...logs];

    if (userFilter) {
      result = result.filter(log => (log.username || '').toLowerCase().includes(userFilter.toLowerCase()));
    }

    if (actionFilter) {
      result = result.filter(log => log.action === actionFilter);
    }

    setFiltered(result);
  }, [userFilter, actionFilter, logs]);

  const uniqueActions = [...new Set(logs.map(log => log.action))];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">📋 Activity Log</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by user..."
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm flex-1"
        />

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm"
        >
          <option value="">All Actions</option>
          {uniqueActions.map((action, i) => (
            <option key={i} value={action}>{action}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Timestamp</th>
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 border">Action</th>
              <th className="px-4 py-2 border">Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-6">No logs found.</td>
              </tr>
            ) : (
              filtered.map((log, idx) => (
                <tr key={idx} className="border-t even:bg-gray-50">
                  <td className="px-4 py-2 border text-gray-600">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2 border">{log.username}</td>
                  <td className="px-4 py-2 border">{log.action}</td>
                  <td className="px-4 py-2 border whitespace-pre-wrap">
                    {Object.entries(log)
                      .filter(([k]) => !['timestamp','username', 'action'].includes(k))
                      .map(([key, val]) => `${key}: ${JSON.stringify(val)}`)
                      .join('\n')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLog;
