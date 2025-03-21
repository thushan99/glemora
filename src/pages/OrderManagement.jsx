// src/pages/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderRef = collection(db, 'orders');
        const orderSnapshot = await getDocs(orderRef);
        const orderList = orderSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(orderList);
        
        // Fetch delivery providers
        const providersRef = collection(db, 'deliveryProviders');
        const providersSnapshot = await getDocs(providersRef);
        const providersList = providersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDeliveryProviders(providersList);
        
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date()
      });
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date() } : order
      ));
      
    } catch (err) {
      setError('Failed to update order status');
      console.error(err);
    }
  };

  const openOrderDetails = async (orderId) => {
    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (orderDoc.exists()) {
        setSelectedOrder({
          id: orderDoc.id,
          ...orderDoc.data()
        });
      }
    } catch (err) {
      setError('Failed to fetch order details');
      console.error(err);
    }
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setSelectedProvider('');
    setDeliveryInfo({
      trackingNumber: '',
      estimatedDelivery: '',
      notes: ''
    });
  };

  const handleDeliverySubmit = async () => {
    if (!selectedOrder || !selectedProvider) return;
    
    try {
      // Update order with delivery information
      await updateDoc(doc(db, 'orders', selectedOrder.id), {
        status: 'shipped',
        deliveryInfo: {
          provider: selectedProvider,
          ...deliveryInfo,
          assignedAt: new Date()
        },
        updatedAt: new Date()
      });
      
      // Also create a delivery entry in a separate collection
      // for the third-party integration (would normally integrate with an API)
      await fetch('https://api.delivery-provider.example/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          provider: selectedProvider,
          trackingNumber: deliveryInfo.trackingNumber,
          customerInfo: selectedOrder.customer,
          shippingAddress: selectedOrder.shippingAddress,
          items: selectedOrder.items
        }),
      });
      
      // Update the orders list
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { 
              ...order, 
              status: 'shipped', 
              deliveryInfo: {
                provider: selectedProvider,
                ...deliveryInfo,
                assignedAt: new Date()
              },
              updatedAt: new Date()
            } 
          : order
      ));
      
      closeOrderDetails();
      
    } catch (err) {
      setError('Failed to update delivery information');
      console.error(err);
    }
  };

  const generateDeliveryReport = () => {
    // Filter orders that have delivery info
    const shippedOrders = orders.filter(order => order.status === 'shipped' && order.deliveryInfo);
    
    // Create CSV content
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
    
    // Create blob and download
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
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
                  <p className="text-sm">{selectedOrder.shippingAddress?.line1 || 'N/A'}</p>
                  {selectedOrder.shippingAddress?.line2 && <p className="text-sm">{selectedOrder.shippingAddress.line2}</p>}
                  <p className="text-sm">
                    {selectedOrder.shippingAddress?.city || 'N/A'}, 
                    {selectedOrder.shippingAddress?.state ? selectedOrder.shippingAddress.state + ', ' : ''} 
                    {selectedOrder.shippingAddress?.postalCode || 'N/A'}
                  </p>
                  <p className="text-sm">{selectedOrder.shippingAddress?.country || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-2">Order Items</h3>
            <div className="bg-gray-50 p-4 rounded mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedOrder.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm">{item.name}</td>
                      <td className="px-4 py-2 text-sm">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm text-right">LKR {item.price?.toFixed(2) || '0.00'}</td>
                      <td className="px-4 py-2 text-sm text-right">LKR {(item.price * item.quantity).toFixed(2) || '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-sm font-medium text-right">Subtotal:</td>
                    <td className="px-4 py-2 text-sm text-right">LKR {selectedOrder.subtotal?.toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-sm font-medium text-right">Shipping:</td>
                    <td className="px-4 py-2 text-sm text-right">LKR {selectedOrder.shippingCost?.toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-sm font-medium text-right">Total:</td>
                    <td className="px-4 py-2 text-sm font-bold text-right">LKR {selectedOrder.total?.toFixed(2) || '0.00'}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Order Status</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm"><span className="font-medium">Current Status:</span> <span className="capitalize">{selectedOrder.status}</span></p>
                <p className="text-sm"><span className="font-medium">Order Date:</span> {selectedOrder.createdAt?.toDate().toLocaleDateString() || 'N/A'}</p>
                <p className="text-sm"><span className="font-medium">Last Updated:</span> {selectedOrder.updatedAt?.toDate().toLocaleDateString() || 'N/A'}</p>
                
                {selectedOrder.deliveryInfo && (
                  <div className="mt-2 border-t border-gray-200 pt-2">
                    <p className="text-sm font-medium">Delivery Information:</p>
                    <p className="text-sm"><span className="font-medium">Provider:</span> {selectedOrder.deliveryInfo.provider}</p>
                    <p className="text-sm"><span className="font-medium">Tracking Number:</span> {selectedOrder.deliveryInfo.trackingNumber}</p>
                    <p className="text-sm"><span className="font-medium">Estimated Delivery:</span> {selectedOrder.deliveryInfo.estimatedDelivery}</p>
                    {selectedOrder.deliveryInfo.notes && <p className="text-sm"><span className="font-medium">Notes:</span> {selectedOrder.deliveryInfo.notes}</p>}
                  </div>
                )}
              </div>
            </div>
            
            {selectedOrder.status === 'processing' && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Send to Delivery Provider</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Delivery Provider</label>
                    <select
                      value={selectedProvider}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-500 focus:border-brown-500"
                    >
                      <option value="">-- Select Provider --</option>
                      {deliveryProviders.map(provider => (
                        <option key={provider.id} value={provider.name}>{provider.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                    <input
                      type="text"
                      value={deliveryInfo.trackingNumber}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, trackingNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-500 focus:border-brown-500"
                      placeholder="Enter tracking number"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery Date</label>
                    <input
                      type="date"
                      value={deliveryInfo.estimatedDelivery}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, estimatedDelivery: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-500 focus:border-brown-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={deliveryInfo.notes}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, notes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brown-500 focus:border-brown-500"
                      rows="2"
                      placeholder="Any special delivery instructions"
                    ></textarea>
                  </div>
                  
                  <button
                    onClick={handleDeliverySubmit}
                    disabled={!selectedProvider || !deliveryInfo.trackingNumber}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                      (!selectedProvider || !deliveryInfo.trackingNumber) 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-brown-800 hover:bg-brown-700'
                    }`}
                  >
                    Send to Delivery Provider
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <button 
                onClick={closeOrderDetails}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;