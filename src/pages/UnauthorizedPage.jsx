import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="bg-red-100 p-6 rounded-full inline-block">
                    <AlertTriangle className="h-16 w-16 text-red-600 mx-auto" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">
                    Unauthorized Access
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    You do not have permission to access this page.
                </p>
                <div className="mt-6">
                    <Link
                        to="/login"
                        className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                        Return to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;