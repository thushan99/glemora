import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // Brown color palette
  const colors = {
    'brown-800': '#5a2f27',
    'brown-700': '#4a251e',
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-gray-900">404</h1>
        <div className="mt-4 mb-8">
          <div className="h-1 w-16 bg-amber-800 mx-auto"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-white text-amber-800 font-medium rounded-lg border border-amber-800 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-700 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-amber-800 text-white font-medium rounded-lg hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;