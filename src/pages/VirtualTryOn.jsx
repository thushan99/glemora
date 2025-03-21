import React, { useState } from 'react';

const VirtualTryOn = () => {
    const [userImage, setUserImage] = useState(null);
    const [clothingImage, setClothingImage] = useState(null);
    const [tryOnResult, setTryOnResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUserImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUserImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleClothingImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setClothingImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const processImages = () => {
        if (userImage && clothingImage) {
            setLoading(true);
            // Simulate processing time
            setTimeout(() => {
                // In a real app, you would call an API to process the images
                // For demo purposes, we're just showing a placeholder result
                setTryOnResult('/api/placeholder/500/600');
                setLoading(false);
            }, 2000);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
           
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Virtual Try-On</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* User Image Upload */}
                        <div className="flex flex-col">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Upload Your Photo</h3>
                            <div className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-64 ${userImage ? 'border-green-500' : 'border-gray-300'}`}>
                                {userImage ? (
                                    <div className="relative w-full h-full">
                                        <img src={userImage} alt="User" className="w-full h-full object-cover rounded" />
                                        <button
                                            onClick={() => setUserImage(null)}
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
                        </div>

                        {/* Clothing Image Upload */}
                        <div className="flex flex-col">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Upload Clothing Item</h3>
                            <div className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-64 ${clothingImage ? 'border-green-500' : 'border-gray-300'}`}>
                                {clothingImage ? (
                                    <div className="relative w-full h-full">
                                        <img src={clothingImage} alt="Clothing" className="w-full h-full object-cover rounded" />
                                        <button
                                            onClick={() => setClothingImage(null)}
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
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                        </svg>
                                        <p className="text-gray-500 text-center mb-4">Upload a clothing item</p>
                                        <label className="bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-md font-medium cursor-pointer">
                                            Select Clothing
                                            <input type="file" className="hidden" accept="image/*" onChange={handleClothingImageUpload} />
                                        </label>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Try-On Result */}
                        <div className="flex flex-col">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Try-On Result</h3>
                            <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-64 border-gray-300">
                                {loading ? (
                                    <div className="flex flex-col items-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700 mb-4"></div>
                                        <p className="text-gray-500">Processing your images...</p>
                                    </div>
                                ) : tryOnResult ? (
                                    <div className="relative w-full h-full">
                                        <img src={tryOnResult} alt="Try-On Result" className="w-full h-full object-cover rounded" />
                                        <button
                                            onClick={() => setTryOnResult(null)}
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
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-gray-500 text-center">Upload both images to see the result</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Process button */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={processImages}
                            disabled={!userImage || !clothingImage || loading}
                            className={`py-3 px-8 rounded-md font-medium text-white ${(!userImage || !clothingImage || loading) ? 'bg-gray-300 cursor-not-allowed' : 'bg-amber-700 hover:bg-amber-800'}`}
                        >
                            {loading ? 'Processing...' : 'Generate Try-On'}
                        </button>
                    </div>

                    {/* Additional information */}
                    <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">How it works</h3>
                        <ol className="list-decimal list-inside text-gray-600 space-y-2">
                            <li>Upload a front-facing photo of yourself</li>
                            <li>Upload an image of the clothing item you want to try on</li>
                            <li>Click "Generate Try-On" to see how the item would look on you</li>
                        </ol>
                        <p className="mt-4 text-sm text-gray-500">For best results, use well-lit photos with clear backgrounds.</p>
                    </div>
                </div>
            </main>
        </div>
        
        </div>
    );
};

export default VirtualTryOn;