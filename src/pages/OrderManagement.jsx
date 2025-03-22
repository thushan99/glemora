import React, { useState, useEffect } from 'react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryProviders, setDeliveryProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState({
    trackingNumber: '',
    estimatedDelivery: '',
    notes: ''
  });

  // Dummy Data
  const dummyOrders = [
    {
      id: '123456',
      customer: { name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
      shippingAddress: {
        line1: '123 Main St',
        line2: 'Apt 4B',
        city: 'Colombo',
        state: 'Western',
        postalCode: '12345',
        country: 'Sri Lanka'
      },
      items: [
        { name: 'Product 1', quantity: 1, price: 100 },
        { name: 'Product 2', quantity: 2, price: 200 },
      ],
      subtotal: 500,
      shippingCost: 50,
      total: 550,
      createdAt: { toDate: () => new Date('2025-03-20') },
      updatedAt: { toDate: () => new Date('2025-03-21') },
      status: 'pending',
      deliveryInfo: null
    },
    {
      id: '789012',
      customer: { name: 'Jane Smith', email: 'jane@example.com', phone: '9876543210' },
      shippingAddress: {
        line1: '456 Elm St',
        line2: '',
        city: 'Kandy',
        state: 'Central',
        postalCode: '67890',
        country: 'Sri Lanka'
      },
      items: [
        { name: 'Product 3', quantity: 1, price: 300 },
        { name: 'Product 4', quantity: 1, price: 400 },
      ],
      subtotal: 700,
      shippingCost: 70,
      total: 770,
      createdAt: { toDate: () => new Date('2025-03-19') },
      updatedAt: { toDate: () => new Date('2025-03-20') },
      status: 'processing',
      deliveryInfo: null
    }
  ];

  const dummyProviders = [
    { id: '1', name: 'DHL' },
    { id: '2', name: 'FedEx' },
    { id: '3', name: 'Sri Lanka Post' }
  ];

  useEffect(() => {
    const fetchOrders = () => {
      setOrders(dummyOrders);
      setDeliveryProviders(dummyProviders);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date() } : order
    ));
  };

  const openOrderDetails = (orderId) => {
    const order = orders.find(order => order.id === orderId);
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setSelectedProvider('');
    setDeliveryInfo({ trackingNumber: '', estimatedDelivery: '', notes: '' });
  };

  const handleDeliverySubmit = () => {
    if (!selectedOrder || !selectedProvider) return;

    // Update the order's delivery info and status
    setOrders(orders.map(order =>
      order.id === selectedOrder.id
        ? { ...order, status: 'shipped', deliveryInfo: { provider: selectedProvider, ...deliveryInfo }, updatedAt: new Date() }
        : order
    ));

    closeOrderDetails();
  };

  const generateDeliveryReport = () => {
    const shippedOrders = orders.filter(order => order.status === 'shipped' && order.deliveryInfo);

    let csvContent = "Order ID,Customer,Delivery Provider,Tracking Number,Shipped Date,Estimated Delivery\n";

    shippedOrders.forEach(order => {
      const row = [
        order.id,
        order.customer?.name || 'N/A',
        order.deliveryInfo?.provider || 'N/A',
        order.deliveryInfo?.trackingNumber || 'N/A',
        order.deliveryInfo?.assignedAt?.toDate().toLocaleDateString() || 'N/A',
        order.deliveryInfo?.estimatedDelivery || 'N/A'
      ];
      csvContent += row.join(',') + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `delivery-report-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) return <div className="text-center p-8">Loading orders...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <button 
          onClick={generateDeliveryReport}
          className="bg-brown-800 text-white px-4 py-2 rounded hover:bg-brown-700"
        >
          Generate Delivery Report
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{order.id.slice(-6)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.customer?.name || 'N/A'}</div>
                  <div className="text-sm text-gray-500">{order.customer?.email || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {order.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">LKR {order.total?.toFixed(2) || '0.00'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="text-sm text-gray-900 border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-brown-500 focus:border-brown-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => openOrderDetails(order.id)} 
                    className="text-brown-600 hover:text-brown-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Order #{selectedOrder.id.slice(-6)}</h2>
              <button onClick={closeOrderDetails} className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm"><span className="font-medium">Name:</span> {selectedOrder.customer?.name || 'N/A'}</p>
                  <p className="text-sm"><span className="font-medium">Email:</span> {selectedOrder.customer?.email || 'N/A'}</p>
                  <p className="text-sm"><span className="font-medium">Phone:</span> {selectedOrder.customer?.phone || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm"><span className="font-medium">Address:</span> {selectedOrder.shippingAddress?.line1}, {selectedOrder.shippingAddress?.line2}</p>
                  <p className="text-sm"><span className="font-medium">City:</span> {selectedOrder.shippingAddress?.city}</p>
                  <p className="text-sm"><span className="font-medium">State:</span> {selectedOrder.shippingAddress?.state}</p>
                  <p className="text-sm"><span className="font-medium">Postal Code:</span> {selectedOrder.shippingAddress?.postalCode}</p>
                  <p className="text-sm"><span className="font-medium">Country:</span> {selectedOrder.shippingAddress?.country}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Items</h3>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Product</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Quantity</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Price</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm">{item.name}</td>
                      <td className="px-4 py-2 text-sm">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm">LKR {item.price.toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm">LKR {(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Delivery Info */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Delivery Information</h3>
              <div className="bg-gray-50 p-4 rounded">
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="text-sm text-gray-900 border border-gray-300 rounded-md py-1 px-2 mb-4 w-full"
                >
                  <option value="">Select Delivery Provider</option>
                  {deliveryProviders.map(provider => (
                    <option key={provider.id} value={provider.name}>{provider.name}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Tracking Number"
                  value={deliveryInfo.trackingNumber}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, trackingNumber: e.target.value })}
                  className="w-full mb-4 p-2 border border-gray-300 rounded"
                />

                <input
                  type="date"
                  value={deliveryInfo.estimatedDelivery}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, estimatedDelivery: e.target.value })}
                  className="w-full mb-4 p-2 border border-gray-300 rounded"
                />

                <textarea
                  placeholder="Notes"
                  value={deliveryInfo.notes}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, notes: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={handleDeliverySubmit}
                className="bg-brown-800 text-white px-4 py-2 rounded hover:bg-brown-700"
              >
                Submit Delivery Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
  