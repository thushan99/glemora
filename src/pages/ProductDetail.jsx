import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import V from '../assets/img/v.jpg';


const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, fetch from your API
    // For demo purposes, we'll create a mock product
    setTimeout(() => {
      setProduct({
        id: parseInt(id),
        name: 'V Neck Dress',
        description: 'Beautiful V neck dress perfect for summer days. Made with high quality fabric that ensures comfort and style. Available in multiple sizes and colors.',
        price: 3590,
        category: 'dresses',
        image: V,
        sale: true,
        originalPrice: 4290,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black', 'White', 'Red'],
        details: [
          'Material: 95% Cotton, 5% Spandex',
          'Hand wash cold, hang dry',
          'Made in Sri Lanka',
          'Model is wearing size M'
        ]
      });
      
      setRelatedProducts([
        { id: 2, name: 'Casual Top', price: 2490, image: '/images/product-2.jpg', sale: false },
        { id: 3, name: 'Summer Skirt', price: 2990, image: '/images/product-3.jpg', sale: true, originalPrice: 3590 },
        { id: 4, name: 'Floral Dress', price: 3890, image: '/images/product-4.jpg', sale: false }
      ]);
      
      setIsLoading(false);
    }, 500);
  }, [id]);
  
  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };
  
  const handleAddToCart = () => {
    // Get existing cart from localStorage or initialize empty array
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => 
      item.productId === product.id && item.size === selectedSize
    );
    
    if (existingItemIndex !== -1) {
      // Update quantity if product already in cart
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.sale ? product.price : product.price,
        image: product.image,
        size: selectedSize,
        quantity: quantity
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show success message or redirect to cart
    alert('Product added to cart!');
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl mb-4">Product Not Found</h2>
            <button 
              onClick={() => navigate('/shop')}
              className="bg-brown-800 text-white px-6 py-2 rounded hover:bg-brown-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
    
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <p>
            <a href="/" className="text-gray-600 hover:text-brown-800">Home</a> {' > '}
            <a href="/shop" className="text-gray-600 hover:text-brown-800">Shop</a> {' > '}
            <a href={`/shop/${product.category}`} className="text-gray-600 hover:text-brown-800 capitalize">{product.category}</a> {' > '}
            <span className="text-brown-800">{product.name}</span>
          </p>
        </div>
      </div>
      
      {/* Product Details */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Images */}
          <div className="md:w-1/2">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-auto object-cover" />
            </div>
          </div>
          
          {/* Product Info */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="mb-4">
              {product.sale ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-brown-800 mr-2">LKR {product.price}</span>
                  <span className="text-lg text-gray-500 line-through">LKR {product.originalPrice}</span>
                  <span className="ml-2 bg-red-600 text-white px-2 py-1 text-xs rounded">SALE</span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-brown-800">LKR {product.price}</span>
              )}
            </div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Size</h3>
              <div className="flex gap-2">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    className={`w-10 h-10 border ${selectedSize === size ? 'border-brown-800 bg-brown-800 text-white' : 'border-gray-300'} rounded-full flex items-center justify-center`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center">
                <button 
                  className="w-10 h-10 border border-gray-300 rounded-l flex items-center justify-center"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input 
                  type="number" 
                  min="1" 
                  value={quantity} 
                  onChange={handleQuantityChange}
                  className="w-16 h-10 border-t border-b border-gray-300 text-center"
                />
                <button 
                  className="w-10 h-10 border border-gray-300 rounded-r flex items-center justify-center"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex gap-4 mb-8">
              <button 
                onClick={handleAddToCart}
                className="bg-brown-800 text-white px-8 py-3 rounded font-bold hover:bg-brown-700 flex-1"
              >
                ADD TO CART
              </button>
              <button className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100">
                <i className="far fa-heart"></i>
              </button>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-2">Product Details</h3>
              <ul className="list-disc pl-5">
                {product.details.map((detail, index) => (
                  <li key={index} className="text-gray-700 mb-1">{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Products */}
      <section className="container mx-auto px-4 py-8 border-t">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <a href={`/product/${product.id}`} className="block relative h-64 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                {product.sale && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded">SALE</div>
                )}
              </a>
              <div className="p-4">
                <a href={`/product/${product.id}`} className="block">
                  <h3 className="text-lg mb-2">{product.name}</h3>
                  {product.sale ? (
                    <div className="flex items-center">
                      <span className="text-brown-800 font-bold mr-2">LKR {product.price}</span>
                      <span className="text-sm text-gray-500 line-through">LKR {product.originalPrice}</span>
                    </div>
                  ) : (
                    <div className="text-brown-800 font-bold">LKR {product.price}</div>
                  )}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;