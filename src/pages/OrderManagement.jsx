import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const OrderManagement = () => {
  const { api } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({
    orderId: null,
    status: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Status options based on your backend
  const statusOptions = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  // Fetch all orders for admin
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/all', {
        headers: {
          'X-Api-Version': 'v1'
        }
      });
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load orders. Please try again later.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle order deletion
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await api.delete(`/orders/${orderId}`, {
          headers: {
            'X-Api-Version': 'v1'
          }
        });
        // Remove order from state
        setOrders(orders.filter(order => order.id !== orderId));
        setError(null);
      } catch (err) {
        setError('Failed to delete order. Please try again.');
        console.error('Error deleting order:', err);
      }
    }
  };

  // Handle status change
  const handleStatusChange = (e, orderId) => {
    setStatusUpdate({
      orderId,
      status: e.target.value
    });
  };

  // Submit status update
  const updateOrderStatus = async () => {
    if (!statusUpdate.orderId || !statusUpdate.status) return;

    try {
      await api.put(`/orders/${statusUpdate.orderId}/status?status=${statusUpdate.status}`, null, {
        headers: {
          'X-Api-Version': 'v1'
        }
      });

      // Update order in state
      setOrders(orders.map(order =>
          order.id === statusUpdate.orderId
              ? { ...order, status: statusUpdate.status }
              : order
      ));

      // Reset status update
      setStatusUpdate({ orderId: null, status: '' });
      setError(null);
    } catch (err) {
      setError('Failed to update order status. Please try again.');
      console.error('Error updating order status:', err);
    }
  };

  // Toggle expanded order view
  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' ||
        (order.id && order.id.toString().includes(searchTerm)) ||
        (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === '' || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Get status badge styling
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 font-medium">Loading orders...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
              Order Management
            </h1>
            <button
                onClick={fetchOrders}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition duration-150 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Orders
            </button>
          </div>

          {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 mb-6">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Orders</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                      type="text"
                      id="search"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                      placeholder="Search by order ID or customer name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full md:w-1/3">
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                <select
                    id="statusFilter"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <svg className="h-12 w-12 text-gray-400 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500 text-lg">No orders found matching your criteria</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map(order => (
                        <React.Fragment key={order.id}>
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.customerName || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.orderDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              ${order.total?.toFixed(2) || '0.00'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                            {order.status || 'PENDING'}
                          </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => toggleOrderDetails(order.id)}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  {expandedOrderId === order.id ? (
                                      <>
                                        <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                        </svg>
                                        Hide
                                      </>
                                  ) : (
                                      <>
                                        <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Details
                                      </>
                                  )}
                                </button>
                                <button
                                    onClick={() => handleDeleteOrder(order.id)}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded row for order details */}
                          {expandedOrderId === order.id && (
                              <tr>
                                <td colSpan="6" className="px-6 py-6 bg-gray-50">
                                  <div className="border-t border-b border-gray-200 bg-white shadow-inner rounded-lg p-4">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                      {/* Order Info */}
                                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">Order Information</h3>
                                        <div className="space-y-2">
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">Order ID:</span>
                                            <span className="font-medium">#{order.id}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">Order Date:</span>
                                            <span>{formatDate(order.orderDate)}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">Status:</span>
                                            <span className={`${getStatusBadgeClass(order.status)} px-2 py-0.5 rounded text-xs`}>
                                        {order.status || 'PENDING'}
                                      </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">Payment Method:</span>
                                            <span>{order.paymentMethod || 'N/A'}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">Shipping Method:</span>
                                            <span>{order.shippingMethod || 'N/A'}</span>
                                          </div>
                                          {order.notes && (
                                              <div className="pt-2 border-t">
                                                <p className="text-gray-500 text-sm">Notes:</p>
                                                <p className="text-gray-700 mt-1">{order.notes}</p>
                                              </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Customer & Shipping Info */}
                                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">Shipping Information</h3>
                                        {order.shippingAddress ? (
                                            <div className="space-y-2">
                                              <p>
                                                <span className="text-gray-500">Name: </span>
                                                <span className="font-medium">{order.customerName || 'Unknown'}</span>
                                              </p>
                                              <p>
                                                <span className="text-gray-500">Email: </span>
                                                <span>{order.customerEmail || 'Unknown'}</span>
                                              </p>
                                              <p>
                                                <span className="text-gray-500">Address: </span>
                                                <span>{order.shippingAddress}</span>
                                              </p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic">No shipping address available</p>
                                        )}
                                      </div>

                                      {/* Order Summary */}
                                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">Order Summary</h3>
                                        <div className="space-y-2">
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">Subtotal:</span>
                                            <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">Tax:</span>
                                            <span>${order.tax?.toFixed(2) || '0.00'}</span>
                                          </div>
                                          <div className="flex justify-between border-t pt-2 mt-2">
                                            <span className="text-gray-700 font-medium">Total:</span>
                                            <span className="text-gray-900 font-bold">${order.total?.toFixed(2) || '0.00'}</span>
                                          </div>
                                        </div>

                                        {/* Update Status */}
                                        <div className="mt-6 pt-4 border-t">
                                          <h4 className="font-medium text-gray-700 mb-2">Update Order Status</h4>
                                          <div className="flex space-x-2">
                                            <select
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                value={statusUpdate.orderId === order.id ? statusUpdate.status : ''}
                                                onChange={(e) => handleStatusChange(e, order.id)}
                                            >
                                              <option value="">Select status</option>
                                              {statusOptions.map(option => (
                                                  <option key={option} value={option}>{option}</option>
                                              ))}
                                            </select>
                                            <button
                                                onClick={updateOrderStatus}
                                                disabled={!statusUpdate.status || statusUpdate.orderId !== order.id}
                                                className="flex-shrink-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300"
                                            >
                                              Update
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Order Items Section */}
                                    <div className="mt-6">
                                      <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
                                      <div className="bg-white overflow-hidden border border-gray-200 rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200">
                                          <thead className="bg-gray-50">
                                          <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                              Product
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                              Quantity
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                              Price
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                              Total
                                            </th>
                                          </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-200">
                                          {order.items && order.items.length > 0 ? (
                                              order.items.map((item, index) => (
                                                  <tr key={item.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                      <div className="flex items-center">
                                                        {item.productImage && (
                                                            <img src={item.productImage} alt={item.productName} className="h-8 w-8 rounded-md mr-3 object-cover" />
                                                        )}
                                                        <span>{item.productName || 'Unknown Product'}</span>
                                                      </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                      {item.quantity}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                      ${item.price?.toFixed(2) || '0.00'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                      ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                                                    </td>
                                                  </tr>
                                              ))
                                          ) : (
                                              <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                  No items found in this order
                                                </td>
                                              </tr>
                                          )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                          )}
                        </React.Fragment>
                    ))}
                    </tbody>
                  </table>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default OrderManagement;