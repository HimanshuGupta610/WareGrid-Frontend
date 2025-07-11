// AppWrapper.js
import { useEffect, useState, useRef } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { isLoggedIn, isAdmin } from './utils/auth';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import ActivityLog from './components/ActivityLog';
import TransferStockForm from './components/TransferStockForm';
import InventoryPage from './pages/InventoryPage';
import BulkUploadProduct from './components/BulkUploadProduct';

function AppWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const admin = isAdmin();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const previousPathRef = useRef(null);

  // Track the last route before navigating to /login
  useEffect(() => {
    if (location.pathname !== '/login') {
      previousPathRef.current = location.pathname;
    }

    if (loggedIn && location.pathname === '/login') {
      setShowLogoutConfirm(true);
    }
  }, [location.pathname, loggedIn]);

  const confirmLogout = () => {
    localStorage.removeItem('token');
    setShowLogoutConfirm(false);
    navigate('/login', { replace: true });
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
    const pathToGoBack = previousPathRef.current || '/';
    navigate(pathToGoBack, { replace: true });
  };

  return (
    <>
      {location.pathname !== '/login' && <Navbar />}

      {/* 🔐 Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">
              You navigated to the login page. Do you want to logout?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={cancelLogout}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={confirmLogout}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔁 Routes */}
      <Routes>
        <Route
          path="/login"
          element={
            loggedIn && showLogoutConfirm
              ? null
              : <Login />
          }
        />

        {loggedIn ? (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/upload/products" element={<BulkUploadProduct />} />
            <Route path="/transfer" element={<TransferStockForm />} />
            {admin && <Route path="/logs" element={<ActivityLog />} />}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </>
  );
}

export default AppWrapper;
