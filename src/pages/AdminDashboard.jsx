import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Clipboard,
  Users,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const adminMenuItems = [
    {
      icon: Users,
      title: 'User Management',
      description: 'Manage user accounts and roles',
      link: '/admin/users'
    },
    {
      icon: Clipboard,
      title: 'Order Management',
      description: 'View and manage customer orders',
      link: '/admin/orders'
    },
    {
      icon: Package,
      title: 'Product Management',
      description: 'Manage product catalog',
      link: '/admin/products'
    },
    {
      icon: Settings,
      title: 'Site Settings',
      description: 'Configure site-wide settings',
      link: '/admin/settings'
    }
  ];

  // If user is not logged in, show a redirect or unauthorized message
  if (!user) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h2>
            <p className="text-gray-600 mb-6">Please log in to access the admin dashboard.</p>
            <Link
                to="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Go to Login
            </Link>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white shadow-md rounded-lg mb-8">
            <div className="p-6 bg-gradient-to-r from-indigo-700 to-indigo-900">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Admin Dashboard
                  </h1>
                  <p className="text-indigo-200 mt-2">
                    Welcome, {user.name || 'Admin'} | Admin Management Portal
                  </p>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center text-white hover:bg-indigo-800 px-4 py-2 rounded-md transition"
                >
                  <LogOut className="mr-2" size={20} />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Admin Sections */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminMenuItems.map((item, index) => (
                <Link
                    key={index}
                    to={item.link}
                    className="group"
                >
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                    <div className="flex items-center mb-4">
                      <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                        <item.icon className="h-6 w-6 text-indigo-700" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </Link>
            ))}
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;