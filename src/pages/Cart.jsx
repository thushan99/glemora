import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/navigation/Navigation';
import Footer from '../components/navigation/Footer';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(300); // Default shipping cost
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    // Get cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
    
    // Calculate totals
    calculateTotals(savedCart);
  }, []);
  
  const calculateTotals = (items) => {
    const itemSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(itemSubtotal);
    setTotal(itemSubtotal + shipping);
  };
  
  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Recalculate totals
    calculateTotals(updatedCart);
  };
  
  const handleRemoveItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Recalculate totals
    calculateTotals(updatedCart);
  };
  
  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    calculateTotals([]);
  };
  
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    
    navigate('/checkout');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Title */}
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">Shopping Cart</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-shopping-cart text-5xl text-gray-300 mb-4"></i>
            <h2 className="text-2xl mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <button 
              onClick={() => navigate('/shop')}
              className="bg-brown-800 text-white px-6 py-2 rounded font-bold hover:bg-brown-700"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left">Product</th>
                      <th className="py-3 px-4 text-center">Price</th>
                      <th className="py-3 px-4 text-center">Quantity</th>
                      <th className="py-3 px-4 text-center">Total</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-gray-600">Size: {item.size}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">LKR {item.price}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center">
                            <button 
                              className="w-8 h-8 border border-gray-300 rounded-l flex items-center justify-center"
                              onClick={() => handleQuantityChange(index, item.quantity - 1)}
                            >
                              -
                            </button>
                            <input 
                              type="number" 
                              min="1" 
                              value={item.quantity} 
                              onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                              className="w-12 h-8 border-t border-b border-gray-300 text-center"
                            />
                            <button 
                              className="w-8 h-8 border border-gray-300 rounded-r flex items-center justify-center"
                              onClick={() => handleQuantityChange(index, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center font-medium">
                          LKR {(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button 
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="p-4 border-t flex justify-between">
                  <button 
                    onClick={() => navigate('/shop')}
                    className="text-brown-800 hover:underline flex items-center"
                  >
                    <i className="fas fa-arrow-left mr-2"></i> Continue Shopping
                  </button>
                  <button 
                    onClick={handleClearCart}
                    className="text-gray-600 hover:text-red-500"
                  >
                    <i className="fas fa-trash mr-2"></i> Clear Cart
                  </button>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="border-b pb-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">LKR {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">LKR {shipping.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold">LKR {total.toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={handleProceedToCheckout}
                  className="w-full bg-brown-800 text-white px-4 py-3 rounded font-bold hover:bg-brown-700"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;