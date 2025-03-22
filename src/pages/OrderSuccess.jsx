import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || 'N/A';
  
  useEffect(() => {
    // If no order number in state, redirect to home
    if (!location.state?.orderNumber) {
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [location.state, navigate]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-2xl text-green-600"></i>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Thank You for Your Order!</h1>
          <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
          
          <div className="border-t border-b py-4 my-4">
            <p className="text-sm text-gray-600 mb-1">Your Order Number</p>
            <p className="text-xl font-bold">{orderNumber}</p>
          </div>
          
          <p className="text-gray-600 mb-6">
            We've sent a confirmation email to your email address with all the details of your order.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/')}
              className="bg-brown-800 text-white px-6 py-2 rounded font-bold hover:bg-brown-700"
            >
              CONTINUE SHOPPING
            </button>
            <button 
              onClick={() => navigate('/orders')}
              className="border border-brown-800 text-brown-800 px-6 py-2 rounded font-bold hover:bg-gray-100"
            >
              VIEW YOUR ORDERS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;