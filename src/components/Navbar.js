import { Link, useNavigate } from 'react-router-dom';
import { isAdmin, isLoggedIn } from '../utils/auth';
import React, { useState } from 'react';
import logo from '../assets/waregrid-logo -1.png';

const Navbar = () => {
  const navigate = useNavigate();
  const adminOnly = isAdmin();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 shadow-md">
      <div className="container mx-auto flex items-center justify-between">

        {/* 🔷 Logo */}
        <div className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Logo"
            className="h-9 w-9 rounded-full object-contain"
          />
          <span className="text-2xl font-bold">WareGrid</span>
        </div>

        {/* 🔷 Desktop Navigation */}
        <div className="hidden md:flex space-x-6 justify-center flex-1">
          {isLoggedIn() && <Link to="/" className="hover:underline">Dashboard</Link>}
          {isLoggedIn() && <Link to="/inventory" className="hover:underline">Inventory</Link>}
          {adminOnly && <Link to="/logs" className="hover:underline">Activity Log</Link>}
        </div>

        {/* 🔷 Logout Button (Desktop) */}
        {isLoggedIn() && (
          <div className="hidden md:block">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
            >
              🔒 Logout
            </button>
          </div>
        )}

        {/* 🔷 Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white focus:outline-none">
            ☰
          </button>
        </div>
      </div>

      {/* 🔷 Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 px-4 space-y-2 text-center">
          {isLoggedIn() && <Link to="/" onClick={() => setMobileOpen(false)} className="block hover:underline">Dashboard</Link>}
          {isLoggedIn() && <Link to="/inventory" onClick={() => setMobileOpen(false)} className="block hover:underline">Inventory</Link>}
          {adminOnly && <Link to="/logs" onClick={() => setMobileOpen(false)} className="block hover:underline">Activity Log</Link>}

          {/* 🔷 Logout Button (Mobile) */}
          {isLoggedIn() && (
            <button
              onClick={() => {
                setShowLogoutConfirm(true);
                setMobileOpen(false);
              }}
              className="w-35 text-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}

      {/* 🔷 Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  localStorage.removeItem('token');
                  navigate('/login', { replace: true });
                }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
