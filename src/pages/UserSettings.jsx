import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserSettings = () => {
    const { user, api } = useAuth();
    const [activeTab, setActiveTab] = useState('account');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        profilePic: null,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch current user data when component mounts
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await api.get('/auth/me', {
                    headers: {
                        'X-Api-Version': 'v1'
                    }
                });

                setFormData(prevState => ({
                    ...prevState,
                    name: response.data.name || '',
                    email: response.data.email || ''
                }));

                setLoading(false);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setNotification({
                    type: 'error',
                    message: 'Failed to load profile data'
                });
                setLoading(false);
            }
        };

        if (user) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [user, api]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'profilePic' && files && files[0]) {
            setFormData(prevState => ({
                ...prevState,
                profilePic: files[0]
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleAccountUpdate = async (e) => {
        e.preventDefault();

        try {
            // Create FormData object for multipart/form-data (for file upload)
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);

            if (formData.profilePic) {
                formDataToSend.append('profilePic', formData.profilePic);
            }

            // Using the /api/auth/update-me endpoint from your backend
            await api.put('/auth/update-me', formDataToSend, {
                headers: {
                    'X-Api-Version': 'v1',
                    'Content-Type': 'multipart/form-data'
                }
            });

            setNotification({
                type: 'success',
                message: 'Account information updated successfully!'
            });

            // Clear notification after 3 seconds
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Update error:', error);
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Failed to update account information.'
            });
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setNotification({
                type: 'error',
                message: 'New passwords do not match.'
            });
            return;
        }

        try {
            // Note: Your backend doesn't have a specific password update endpoint
            // This is a placeholder - you would need to implement this endpoint
            const formDataToSend = new FormData();
            formDataToSend.append('currentPassword', formData.currentPassword);
            formDataToSend.append('newPassword', formData.newPassword);

            await api.put('/auth/update-password', formDataToSend, {
                headers: {
                    'X-Api-Version': 'v1'
                }
            });

            setNotification({
                type: 'success',
                message: 'Password updated successfully!'
            });

            // Clear form data
            setFormData(prevState => ({
                ...prevState,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));

            // Clear notification after 3 seconds
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Password update error:', error);
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Failed to update password. Please check your current password.'
            });
        }
    };

    if (loading) return <div className="text-center py-8">Loading settings...</div>;
    if (!user) return <div className="text-center py-8">Please log in to access settings</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-4xl mx-auto">
                <div className="bg-brown-800 text-white px-6 py-4">
                    <h2 className="text-2xl font-bold">Account Settings</h2>
                </div>

                {notification && (
                    <div className={`px-6 py-3 ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {notification.message}
                    </div>
                )}

                <div className="flex border-b">
                    <button
                        className={`px-6 py-3 font-medium ${activeTab === 'account' ? 'border-b-2 border-brown-800 text-brown-800' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('account')}
                    >
                        Account Information
                    </button>
                    <button
                        className={`px-6 py-3 font-medium ${activeTab === 'password' ? 'border-b-2 border-brown-800 text-brown-800' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('password')}
                    >
                        Change Password
                    </button>
                    <button
                        className={`px-6 py-3 font-medium ${activeTab === 'preferences' ? 'border-b-2 border-brown-800 text-brown-800' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('preferences')}
                    >
                        Preferences
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'account' && (
                        <form onSubmit={handleAccountUpdate} encType="multipart/form-data">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profilePic">
                                    Profile Picture
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="profilePic"
                                    type="file"
                                    name="profilePic"
                                    accept="image/*"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Full Name
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email address"
                                />
                            </div>
                            <div className="flex items-center justify-end">
                                <button
                                    className="bg-brown-800 hover:bg-brown-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'password' && (
                        <form onSubmit={handlePasswordUpdate}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
                                    Current Password
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="currentPassword"
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Enter your current password"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                                    New Password
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="newPassword"
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Enter your new password"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                    Confirm New Password
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your new password"
                                />
                            </div>
                            <div className="flex items-center justify-end">
                                <button
                                    className="bg-brown-800 hover:bg-brown-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'preferences' && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <input
                                        id="email-notifications"
                                        type="checkbox"
                                        className="h-4 w-4 text-brown-800 focus:ring-brown-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                                        Email notifications for new products
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="promo-notifications"
                                        type="checkbox"
                                        className="h-4 w-4 text-brown-800 focus:ring-brown-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="promo-notifications" className="ml-2 block text-sm text-gray-700">
                                        Promotional emails and offers
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="order-updates"
                                        type="checkbox"
                                        className="h-4 w-4 text-brown-800 focus:ring-brown-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="order-updates" className="ml-2 block text-sm text-gray-700">
                                        Order status updates
                                    </label>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold mt-6 mb-4">Language and Region</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="language">
                                        Language
                                    </label>
                                    <select
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="language"
                                    >
                                        <option value="en">English</option>
                                        <option value="si">Sinhala</option>
                                        <option value="ta">Tamil</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currency">
                                        Currency
                                    </label>
                                    <select
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="currency"
                                    >
                                        <option value="lkr">LKR - Sri Lankan Rupee</option>
                                        <option value="usd">USD - US Dollar</option>
                                        <option value="eur">EUR - Euro</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-6">
                                <button
                                    className="bg-brown-800 hover:bg-brown-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                >
                                    Save Preferences
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
