import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import the auth context

const VirtualTryOn = () => {
    const { api, isAuthenticated } = useAuth(); // Use the api instance from auth context
    const [currentStep, setCurrentStep] = useState(1);
    const [userImageFile, setUserImageFile] = useState(null);
    const [userImagePreview, setUserImagePreview] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [tryOnResult, setTryOnResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);

    // Fetch products from the backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products', {
                    headers: {
                        'X-Api-Version': 'v1'
                    }
                });
                setProducts(response.data);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again.');
            }
        };

        fetchProducts();
    }, [api]);

    const handleUserImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUserImageFile(file);
            setUserImagePreview(URL.createObjectURL(file));
            setCurrentStep(2);
        }
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
    };

    const processImages = async () => {
        if (!userImageFile || !selectedProduct) {
            setError('Both user image and product must be selected');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Create form data for API request - matches backend controller parameters
            const formData = new FormData();
            formData.append('userImage', userImageFile);
            formData.append('productId', selectedProduct.id);

            // Make API request using the configured axios instance
            const response = await api.post('/tryon/user-product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            // Set result from API response - using the correct field name
            // Based on the Postman response structure
            setTryOnResult(response.data.generatedImageUrl);
            setCurrentStep(3);
        } catch (err) {
            console.error('Error processing try-on:', err);
            setError('Failed to process try-on. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetProcess = () => {
        setUserImageFile(null);
        setUserImagePreview(null);
        setSelectedProduct(null);
        setTryOnResult(null);
        setLoading(false);
        setError(null);
        setCurrentStep(1);
    };

    // Check if user is authenticated before allowing try-on
    const handleTryOnClick = () => {
        if (!isAuthenticated) {
            setError('Please log in to use the virtual try-on feature');
            return;
        }
        processImages();
    };

    // Debug function to track response structure
    const debugResponse = (data) => {
        console.log('Response data structure:', data);
        // If you need to check specific fields
        console.log('Generated image URL:', data.generatedImageUrl);
        console.log('Result image URL (if exists):', data.resultImageUrl);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Virtual Try-On</h2>

                    {/* Display error message if any */}
                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                            {error}
                        </div>
                    )}

                    {/* Step 1: User Image Upload */}
                    {currentStep === 1 && (
                        <div className="flex flex-col items-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Upload Your Photo</h3>
                            <div className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center w-full max-w-md h-64 ${userImagePreview ? 'border-green-500' : 'border-gray-300'}`}>
                                {userImagePreview ? (
                                    <div className="relative w-full h-full">
                                        <img src={userImagePreview} alt="User" className="w-full h-full object-cover rounded" />
                                        <button
                                            onClick={() => {
                                                setUserImagePreview(null);
                                                setUserImageFile(null);
                                            }}
                                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <p className="text-gray-500 text-center mb-4">Upload a front-facing photo</p>
                                        <label className="bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-md font-medium cursor-pointer">
                                            Select Photo
                                            <input type="file" className="hidden" accept="image/*" onChange={handleUserImageUpload} />
                                        </label>
                                    </>
                                )}
                            </div>

                            {/* Authentication notice */}
                            {!isAuthenticated && (
                                <div className="mt-4 p-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
                                    You need to be logged in to use the virtual try-on feature.
                                </div>
                            )}

                            {/* Additional information */}
                            <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">How it works</h3>
                                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                                    <li>Upload a front-facing photo of yourself</li>
                                    <li>Browse and select a product from our catalog</li>
                                    <li>Click "Generate Try-On" to see how the item would look on you</li>
                                </ol>
                                <p className="mt-4 text-sm text-gray-500">For best results, use well-lit photos with clear backgrounds.</p>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Product Selection */}
                    {currentStep === 2 && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Select a Product</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {products.length > 0 ? (
                                    products.map(product => (
                                        <div
                                            key={product.id}
                                            onClick={() => handleProductSelect(product)}
                                            className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all ${
                                                selectedProduct?.id === product.id
                                                    ? 'border-amber-700 bg-amber-50'
                                                    : 'border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={product.image || '/api/placeholder/200/300'}
                                                alt={product.name}
                                                className="w-full h-48 object-cover rounded mb-2"
                                            />
                                            <h4 className="font-medium">{product.name}</h4>
                                            <p className="text-gray-500">${product.price?.toFixed(2) || '0.00'}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-4 text-center py-8">
                                        <p className="text-gray-500">Loading products...</p>
                                    </div>
                                )}
                            </div>
                            {selectedProduct && (
                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={handleTryOnClick}
                                        className="bg-amber-700 hover:bg-amber-800 text-white py-3 px-8 rounded-md font-medium"
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Generate Try-On'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Try-On Result */}
                    {currentStep === 3 && (
                        <div className="flex flex-col items-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Try-On Result</h3>
                            {loading ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700 mb-4"></div>
                                    <p className="text-gray-500">Processing your images...</p>
                                </div>
                            ) : (
                                <>
                                    {tryOnResult ? (
                                        <div className="relative w-full max-w-md h-96">
                                            <img
                                                src={tryOnResult}
                                                alt="Try-On Result"
                                                className="w-full h-full object-cover rounded"
                                                onError={(e) => {
                                                    console.error("Error loading image:", tryOnResult);
                                                    e.target.onerror = null;
                                                    e.target.src = '/api/placeholder/400/600';
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="bg-red-50 text-red-700 p-4 rounded-md">
                                            Failed to load try-on result image.
                                        </div>
                                    )}
                                    <div className="mt-6 flex space-x-4">
                                        <button
                                            onClick={resetProcess}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-8 rounded-md font-medium"
                                        >
                                            Try Another
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Add to cart logic would go here
                                                api.post('/cart', null, {
                                                    params: {
                                                        productId: selectedProduct.id,
                                                        quantity: 1,
                                                        size: 'M' // Default size, you might want to add size selection
                                                    }
                                                }).then(() => {
                                                    alert('Product added to cart!');
                                                }).catch(err => {
                                                    console.error('Error adding to cart:', err);
                                                    alert('Failed to add product to cart.');
                                                });
                                            }}
                                            className="bg-amber-700 hover:bg-amber-800 text-white py-3 px-8 rounded-md font-medium"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default VirtualTryOn;