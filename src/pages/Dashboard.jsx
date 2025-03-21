// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const Dashboard = () => {
  const { currentUser, isAdmin, isStaff } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!currentUser) return;
      
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('customer.uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const ordersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersList);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [currentUser]);

  if (loading) return <div className="text-center p-8">Loading dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <p className="mb-2"><span className="font-medium">Name:</span> {currentUser.displayName || 'N/A'}</p>
          <p className="mb-2"><span className="font-medium">Email:</span> {currentUser.email}</p>
          <div className="mt-4">
            <Link to="/profile" className="text-brown-800 hover:text-brown-600 font-medium">
              Edit Profile
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <p>You haven't placed any orders yet.</p>
          ) : (
            <div>
              <p className="mb-2">You have {orders.length} order(s).</p>
              <Link to="/orders" className="text-brown-800 hover:text-brown-600 font-medium">
                View All Orders
              </Link>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
          <Link to="/addresses" className="text-brown-800 hover:text-brown-600 font-medium">
            Manage Addresses
          </Link>
        </div>
      </div>
      
      {isAdmin() && (
        <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/admin/users" 
              className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium mb-2">User Management</h3>
              <p className="text-sm text-gray-600">Manage user accounts and roles</p>
            </Link>
            
            <Link 
              to="/admin/orders" 
              className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium mb-2">Order Management</h3>
              <p className="text-sm text-gray-600">View and manage customer orders</p>
            </Link>
            
            <Link 
              to="/admin/products" 
              className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium mb-2">Product Management</h3>
              <p className="text-sm text-gray-600">Manage product catalog</p>
            </Link>
          </div>
        </div>
      )}
      
      {isStaff() && !isAdmin() && (
        <div className="bg-blue-50 border border-blue-300 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Staff Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              to="/admin/orders" 
              className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium mb-2">Order Management</h3>
              <p className="text-sm text-gray-600">Verify orders and update status</p>
            </Link>
            
            <Link 
              to="/admin/products" 
              className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium mb-2">Product Management</h3>
              <p className="text-sm text-gray-600">Manage product catalog</p>
            </Link>
          </div>
        </div>
      )}
      
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default Dashboard;