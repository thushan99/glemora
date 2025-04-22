import React from 'react';
import { Link } from 'react-router-dom';
import {
    ShoppingBag,
    User,
    MapPin,
    Heart,
    LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserDashboard = () => {
    const { user, logout } = useAuth();

    const userMenuItems = [
        {
            icon: User,
            title: 'Profile',
            description: 'Manage your personal information',
            link: '/profile'
        },
        {
            icon: ShoppingBag,
            title: 'My Orders',
            description: 'View your order history',
            link: '/user/orders'
        },
        {
            icon: MapPin,
            title: 'Addresses',
            description: 'Manage shipping addresses',
            link: '/user/addresses'
        },
        {
            icon: Heart,
            title: 'Wishlist',
            description: 'View your saved items',
            link: '/user/wishlist'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white shadow-md rounded-lg mb-8">
                    <div className="p-6 bg-gradient-to-r from-green-700 to-green-900">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-white">
                                    My Dashboard
                                </h1>
                                <p className="text-green-200 mt-2">
                                    Welcome back, {user.name}
                                </p>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center text-white hover:bg-green-800 px-4 py-2 rounded-md transition"
                            >
                                <LogOut className="mr-2" size={20} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* User Sections */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {userMenuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.link}
                            className="group"
                        >
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                                <div className="flex items-center mb-4">
                                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                                        <item.icon className="h-6 w-6 text-green-700" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {item.title}
                                    </h3>
                                </div>
                                <p className="text-gray-600">
                                    {item.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;