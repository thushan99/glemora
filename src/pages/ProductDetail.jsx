import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api, isAuthenticated } = useAuth(); // Make sure to get isAuthenticated
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Available sizes (could be fetched from API in a real application)
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL'];

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);

        // Fetch the product details
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);

        // Set default selected size if available
        if (response.data && availableSizes.length > 0) {
          setSelectedSize(availableSizes[2]); // Default to 'M'
        }

        // Fetch related products (products in the same category)
        if (response.data && response.data.category) {
          const relatedResponse = await api.get(`/products`, {
            params: { categoryId: response.data.category.id }
          });

          // Filter out the current product and limit to 4 products
          const filteredRelated = relatedResponse.data
              .filter(p => p.id !== parseInt(id))
              .slice(0, 4);

          setRelatedProducts(filteredRelated);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, api]);

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleAddToCart = async () => {
    try {
      if (product.stockQuantity < quantity) {
        alert(`Sorry, only ${product.stockQuantity} items available in stock.`);
        return;
      }

      if (isAuthenticated) {
        // For authenticated users, use the API
        await api.post('/cart', null, {
          params: {
            productId: product.id,
            quantity: quantity,
            size: selectedSize
          }
        });
        alert('Product added to cart!');
      } else {
        // For non-authenticated users, use localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        const existingItemIndex = cart.findIndex(item =>
            item.productId === product.id && item.size === selectedSize
        );

        if (existingItemIndex !== -1) {
          cart[existingItemIndex].quantity += quantity;
        } else {
          cart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            quantity: quantity
          });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Product added to cart!');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart. Please try again.');
    }
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

  if (error || !product) {
    return (
        <div className="flex flex-col min-h-screen">
          <div className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl mb-4">Product Not Found</h2>
              <p className="text-gray-600 mb-4">{error || "The requested product could not be found."}</p>
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
              <Link to="/" className="text-gray-600 hover:text-brown-800">Home</Link> {' > '}
              <Link to="/shop" className="text-gray-600 hover:text-brown-800">Shop</Link> {' > '}
              {product.category && (
                  <>
                    <Link
                        to={`/shop?category=${product.category.id}`}
                        className="text-gray-600 hover:text-brown-800 capitalize"
                    >
                      {product.category.name}
                    </Link> {' > '}
                  </>
              )}
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
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg'; // Fallback image
                    }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

              <div className="mb-4">
                {product.sale ? (
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-brown-800 mr-2">LKR {product.price}</span>
                      <span className="text-lg text-gray-500 line-through">
                    LKR {(product.price * 1.2).toFixed(2)}
                  </span>
                      <span className="ml-2 bg-red-600 text-white px-2 py-1 text-xs rounded">SALE</span>
                    </div>
                ) : (
                    <span className="text-2xl font-bold text-brown-800">LKR {product.price}</span>
                )}
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              {/* Stock Information */}
              <div className="mb-4">
                <p className={`font-semibold ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stockQuantity > 0
                      ? `In Stock (${product.stockQuantity} available)`
                      : 'Out of Stock'}
                </p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Size</h3>
                <div className="flex gap-2">
                  {availableSizes.map(size => (
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
                      disabled={product.stockQuantity <= 0}
                  >
                    -
                  </button>
                  <input
                      type="number"
                      min="1"
                      max={product.stockQuantity}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 h-10 border-t border-b border-gray-300 text-center"
                      disabled={product.stockQuantity <= 0}
                  />
                  <button
                      className="w-10 h-10 border border-gray-300 rounded-r flex items-center justify-center"
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      disabled={product.stockQuantity <= 0 || quantity >= product.stockQuantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                <button
                    onClick={handleAddToCart}
                    className={`px-8 py-3 rounded font-bold flex-1 ${
                        product.stockQuantity > 0
                            ? 'bg-brown-800 text-white hover:bg-brown-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={product.stockQuantity <= 0}
                >
                  {product.stockQuantity > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
                </button>
                <button className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100">
                  <i className="far fa-heart"></i>
                </button>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-2">Product Details</h3>
                <ul className="list-disc pl-5">
                  <li className="text-gray-700 mb-1">Category: {product.category ? product.category.name : 'Uncategorized'}</li>
                  {product.featured && <li className="text-gray-700 mb-1">Featured Product</li>}
                  <li className="text-gray-700 mb-1">Product ID: {product.id}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
            <section className="container mx-auto px-4 py-8 border-t">
              <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map(relatedProduct => (
                    <div key={relatedProduct.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <Link to={`/product/${relatedProduct.id}`} className="block relative h-64 overflow-hidden">
                        <img
                            src={relatedProduct.image}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg'; // Fallback image
                            }}
                        />
                        {relatedProduct.sale && (
                            <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded">SALE</div>
                        )}
                      </Link>
                      <div className="p-4">
                        <Link to={`/product/${relatedProduct.id}`} className="block">
                          <h3 className="text-lg mb-2">{relatedProduct.name}</h3>
                          {relatedProduct.sale ? (
                              <div className="flex items-center">
                                <span className="text-brown-800 font-bold mr-2">LKR {relatedProduct.price}</span>
                                <span className="text-sm text-gray-500 line-through">
                          LKR {(relatedProduct.price * 1.2).toFixed(2)}
                        </span>
                              </div>
                          ) : (
                              <div className="text-brown-800 font-bold">LKR {relatedProduct.price}</div>
                          )}
                        </Link>
                      </div>
                    </div>
                ))}
              </div>
            </section>
        )}
      </div>
  );
};

export default ProductDetail;
