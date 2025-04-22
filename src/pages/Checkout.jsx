import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Adjust path as needed

const Checkout = () => {
  const navigate = useNavigate();
  const { api, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(300);
  const [total, setTotal] = useState(0);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    fetchCart();
  }, [isAuthenticated, navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      const cartData = response.data;

      // Transform API response to match our component's state structure
      const items = cartData.items.map(item => ({
        id: item.id,
        name: item.productName,
        image: item.productImage,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        productId: item.productId
      }));

      // Redirect to cart if empty
      if (items.length === 0) {
        navigate('/cart');
        return;
      }

      setCartItems(items);
      setSubtotal(cartData.totalPrice);
      setTotal(cartData.totalPrice + shipping);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart. Please try again.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails({
      ...shippingDetails,
      [name]: value
    });
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    // Validate form
    if (!shippingDetails.firstName || !shippingDetails.lastName || !shippingDetails.email ||
        !shippingDetails.phone || !shippingDetails.address || !shippingDetails.city ||
        !shippingDetails.postalCode) {
      alert('Please fill in all required fields.');
      return;
    }

    // Move to payment step
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Move to review step
    setStep(3);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    try {
      // Create order request object
      const orderRequest = {
        addressLine1: shippingDetails.address,
        addressLine2: '',
        city: shippingDetails.city,
        state: '',
        postalCode: shippingDetails.postalCode,
        country: 'Sri Lanka',
        isDefaultAddress: false,
        shippingMethod: 'Standard Delivery',
        shippingCost: shipping,
        paymentMethod: paymentMethod,
        notes: shippingDetails.notes
      };

      // Send order to backend
      const response = await api.post('/orders', orderRequest);
      const orderData = response.data;

      // Navigate to success page
      navigate('/order-success', {
        state: {
          orderNumber: orderData.id
        }
      });
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
    }
  };

  const getStepClass = (stepNumber) => {
    if (stepNumber === step) {
      return 'bg-brown-800 text-white';
    } else if (stepNumber < step) {
      return 'bg-green-600 text-white';
    } else {
      return 'bg-gray-200 text-gray-600';
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-800"></div>
        </div>
    );
  }

  // Rest of your component remains the same...
  return (
      <div className="flex flex-col min-h-screen">
        {/* Page Title */}
        <div className="bg-gray-100 py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center">Checkout</h1>
          </div>
        </div>

        {error && (
            <div className="container mx-auto px-4 py-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            </div>
        )}

        {/* Checkout Steps */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-3xl flex justify-between">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${getStepClass(1)}`}>
                  <span>1</span>
                </div>
                <span className="text-sm font-medium">Shipping</span>
              </div>
              <div className="relative flex items-center flex-1 mx-4">
                <div className="h-1 w-full bg-gray-200"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${getStepClass(2)}`}>
                  <span>2</span>
                </div>
                <span className="text-sm font-medium">Payment</span>
              </div>
              <div className="relative flex items-center flex-1 mx-4">
                <div className="h-1 w-full bg-gray-200"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${getStepClass(3)}`}>
                  <span>3</span>
                </div>
                <span className="text-sm font-medium">Review</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              {step === 1 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                    <form onSubmit={handleShippingSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block mb-1 text-sm font-medium">First Name*</label>
                          <input
                              type="text"
                              name="firstName"
                              value={shippingDetails.firstName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border rounded"
                              required
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium">Last Name*</label>
                          <input
                              type="text"
                              name="lastName"
                              value={shippingDetails.lastName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border rounded"
                              required
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium">Email Address*</label>
                          <input
                              type="email"
                              name="email"
                              value={shippingDetails.email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border rounded"
                              required
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium">Phone Number*</label>
                          <input
                              type="tel"
                              name="phone"
                              value={shippingDetails.phone}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border rounded"
                              required
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium">Address*</label>
                        <input
                            type="text"
                            name="address"
                            value={shippingDetails.address}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block mb-1 text-sm font-medium">City*</label>
                          <input
                              type="text"
                              name="city"
                              value={shippingDetails.city}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border rounded"
                              required
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium">Postal Code*</label>
                          <input
                              type="text"
                              name="postalCode"
                              value={shippingDetails.postalCode}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border rounded"
                              required
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block mb-1 text-sm font-medium">Order Notes (Optional)</label>
                        <textarea
                            name="notes"
                            value={shippingDetails.notes}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded"
                            rows="3"
                        ></textarea>
                      </div>

                      <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => navigate('/cart')}
                            className="text-brown-800 hover:underline flex items-center"
                        >
                          <i className="fas fa-arrow-left mr-2"></i> Return to Cart
                        </button>
                        <button
                            type="submit"
                            className="bg-brown-800 text-white px-6 py-2 rounded font-bold hover:bg-brown-700"
                        >
                          CONTINUE TO PAYMENT
                        </button>
                      </div>
                    </form>
                  </div>
              )}

              {step === 2 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                    <form onSubmit={handlePaymentSubmit}>
                      <div className="mb-6">
                        <div className="mb-4">
                          <label className="flex items-center">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cash"
                                checked={paymentMethod === 'cash'}
                                onChange={handlePaymentMethodChange}
                                className="mr-2"
                            />
                            <span className="font-medium">Cash on Delivery</span>
                          </label>
                          <p className="text-sm text-gray-600 mt-1 ml-5">Pay with cash upon delivery.</p>
                        </div>

                        <div className="mb-4">
                          <label className="flex items-center">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="bank"
                                checked={paymentMethod === 'bank'}
                                onChange={handlePaymentMethodChange}
                                className="mr-2"
                            />
                            <span className="font-medium">Bank Transfer</span>
                          </label>
                          <p className="text-sm text-gray-600 mt-1 ml-5">
                            Make your payment directly into our bank account. Please use your Order ID as the payment reference.
                          </p>

                          {paymentMethod === 'bank' && (
                              <div className="bg-gray-50 p-4 mt-2 ml-5 rounded">
                                <h4 className="font-medium mb-2">Bank Account Details:</h4>
                                <ul className="text-sm">
                                  <li><strong>Bank:</strong> Sample Bank</li>
                                  <li><strong>Account Number:</strong> 1234567890</li>
                                  <li><strong>Branch:</strong> Main Branch</li>
                                  <li><strong>Account Name:</strong> Molly Fashion</li>
                                </ul>
                              </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-brown-800 hover:underline flex items-center"
                        >
                          <i className="fas fa-arrow-left mr-2"></i> Back to Shipping
                        </button>
                        <button
                            type="submit"
                            className="bg-brown-800 text-white px-6 py-2 rounded font-bold hover:bg-brown-700"
                        >
                          REVIEW ORDER
                        </button>
                      </div>
                    </form>
                  </div>
              )}

              {step === 3 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Order Review</h2>

                    <div className="mb-6">
                      <h3 className="font-medium mb-2">Shipping Information</h3>
                      <div className="bg-gray-50 p-4 rounded">
                        <p><strong>Name:</strong> {shippingDetails.firstName} {shippingDetails.lastName}</p>
                        <p><strong>Email:</strong> {shippingDetails.email}</p>
                        <p><strong>Phone:</strong> {shippingDetails.phone}</p>
                        <p><strong>Address:</strong> {shippingDetails.address}, {shippingDetails.city}, {shippingDetails.postalCode}</p>
                        {shippingDetails.notes && (
                            <p><strong>Notes:</strong> {shippingDetails.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-medium mb-2">Payment Method</h3>
                      <div className="bg-gray-50 p-4 rounded">
                        <p>{paymentMethod === 'cash' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-medium mb-2">Order Items</h3>
                      <div className="bg-gray-50 p-4 rounded">
                        {cartItems.map((item, index) => (
                            <div key={item.id || index} className={`flex justify-between ${index !== cartItems.length - 1 ? 'border-b pb-2 mb-2' : ''}`}>
                              <div className="flex items-center">
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-3" />
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p>LKR {item.price.toFixed(2)}</p>
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                          onClick={() => setStep(2)}
                          className="text-brown-800 hover:underline flex items-center"
                      >
                        <i className="fas fa-arrow-left mr-2"></i> Back to Payment
                      </button>
                      <button
                          onClick={handlePlaceOrder}
                          className="bg-brown-800 text-white px-6 py-2 rounded font-bold hover:bg-brown-700"
                      >
                        PLACE ORDER
                      </button>
                    </div>
                  </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="mb-4">
                  <h3 className="font-medium mb-2">Products ({cartItems.length})</h3>
                  <div className="max-h-64 overflow-y-auto">
                    {cartItems.map((item, index) => (
                        <div key={item.id || index} className={`flex justify-between items-center ${index !== cartItems.length - 1 ? 'border-b pb-2 mb-2' : ''}`}>
                          <div className="flex items-center">
                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded mr-2" />
                            <span className="text-sm">{item.name} x{item.quantity}</span>
                          </div>
                          <span className="text-sm">LKR {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-b py-4 mb-4">
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
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Checkout;
