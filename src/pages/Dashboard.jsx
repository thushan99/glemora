import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, MapPin, Users, Package, Clipboard, Settings } from 'lucide-react';

const Dashboard = () => {
  // Dummy current user data
  const currentUser = {
    uid: '1',
    displayName: 'John Doe',
    email: 'john.doe@example.com'
  };

  // Dummy order data
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Simulate fetching user orders
  useEffect(() => {
    const fetchUserOrders = () => {
      try {
        const dummyOrders = [
          {
            id: '1',
            totalPrice: 29.99,
            status: 'Completed',
            createdAt: new Date('2023-03-01')
          },
          {
            id: '2',
            totalPrice: 15.49,
            status: 'Pending',
            createdAt: new Date('2023-03-10')
          }
        ];
        setOrders(dummyOrders);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  // Dummy role-check functions
  const isAdmin = () => currentUser.email === 'admin@example.com';
  const isStaff = () => currentUser.email === 'staff@example.com';

  // Brown color palette 
  const colors = {
    'brown-800': '#5a2f27',
    'brown-700': '#4a251e',
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-amber-50">
      <div className="text-xl font-medium text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-4 border-t-amber-700 border-gray-200 rounded-full animate-spin"></div>
          <span>Loading dashboard...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6">
        <div className="bg-white shadow rounded-xl overflow-hidden mb-8">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-700 to-amber-900">
            <h1 className="text-3xl font-bold text-amber-50">Welcome back, {currentUser.displayName}</h1>
            <p className="text-amber-200 mt-2">Manage your account and view your recent activities</p>
          </div>
      
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-amber-100 p-3 rounded-lg mr-4">
                  <User className="h-6 w-6 text-amber-800" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Account</h2>
              </div>
              <p className="mb-2 text-gray-600"><span className="font-medium text-gray-800">Name:</span> {currentUser.displayName || 'N/A'}</p>
              <p className="mb-4 text-gray-600"><span className="font-medium text-gray-800">Email:</span> {currentUser.email}</p>
              <Link to="/profile" className="inline-flex items-center px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors font-medium text-sm">
                Edit Profile
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-amber-100 p-3 rounded-lg mr-4">
                  <ShoppingBag className="h-6 w-6 text-amber-800" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Orders</h2>
              </div>
              {orders.length === 0 ? (
                <p className="text-gray-600">You haven't placed any orders yet.</p>
              ) : (
                <div>
                  <div className="space-y-3 mb-4">
                    {orders.slice(0, 2).map(order => (
                      <div key={order.id} className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">{order.createdAt.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                          <p className="text-right font-medium mt-1">${order.totalPrice}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link to="/orders" className="inline-flex items-center px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors font-medium text-sm">
                    View All Orders
                  </Link>
                </div>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-amber-100 p-3 rounded-lg mr-4">
                  <MapPin className="h-6 w-6 text-amber-800" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Addresses</h2>
              </div>
              <p className="mb-4 text-gray-600">Manage your shipping and billing addresses for faster checkout.</p>
              <Link to="/addresses" className="inline-flex items-center px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors font-medium text-sm">
                Manage Addresses
              </Link>
            </div>
          </div>
        </div>
        
        {isAdmin() && (
          <div className="bg-white shadow rounded-xl overflow-hidden mb-8">
            <div className="p-6 bg-gradient-to-r from-amber-800 to-amber-950">
              <h2 className="text-2xl font-bold text-amber-50">Admin Dashboard</h2>
              <p className="text-amber-200">Manage your store and monitor performance</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              <Link to="/admin/users" className="group">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md group-hover:border-amber-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-100 p-3 rounded-lg mr-4 group-hover:bg-amber-200 transition-colors">
                      <Users className="h-6 w-6 text-amber-800" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">User Management</h3>
                  </div>
                  <p className="text-gray-600">Manage user accounts and roles</p>
                </div>
              </Link>
              
              <Link to="/admin/orders" className="group">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md group-hover:border-amber-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-100 p-3 rounded-lg mr-4 group-hover:bg-amber-200 transition-colors">
                      <Clipboard className="h-6 w-6 text-amber-800" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Order Management</h3>
                  </div>
                  <p className="text-gray-600">View and manage customer orders</p>
                </div>
              </Link>
              
              <Link to="/admin/products" className="group">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md group-hover:border-amber-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-100 p-3 rounded-lg mr-4 group-hover:bg-amber-200 transition-colors">
                      <Package className="h-6 w-6 text-amber-800" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Product Management</h3>
                  </div>
                  <p className="text-gray-600">Manage product catalog</p>
                </div>
              </Link>
            </div>
          </div>
        )}
        
        {isStaff() && !isAdmin() && (
          <div className="bg-white shadow rounded-xl overflow-hidden mb-8">
            <div className="p-6 bg-gradient-to-r from-amber-700 to-amber-900">
              <h2 className="text-2xl font-bold text-amber-50">Staff Dashboard</h2>
              <p className="text-amber-200">Handle orders and manage inventory</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <Link to="/admin/orders" className="group">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md group-hover:border-amber-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-100 p-3 rounded-lg mr-4 group-hover:bg-amber-200 transition-colors">
                      <Clipboard className="h-6 w-6 text-amber-800" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Order Management</h3>
                  </div>
                  <p className="text-gray-600">Verify orders and update status</p>
                </div>
              </Link>
              
              <Link to="/admin/products" className="group">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md group-hover:border-amber-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-100 p-3 rounded-lg mr-4 group-hover:bg-amber-200 transition-colors">
                      <Package className="h-6 w-6 text-amber-800" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Product Management</h3>
                  </div>
                  <p className="text-gray-600">Manage product catalog</p>
                </div>
              </Link>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;