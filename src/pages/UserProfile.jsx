import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
    const { user, api } = useAuth();
    const [profile, setProfile] = useState({
        employeeId: '',
        username: '',
        name: '',
        email: '',
        profilePic: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Using the correct endpoint with required headers
                const response = await api.get('/auth/me', {
                    headers: {
                        'X-Api-Version': 'v1'
                    }
                });
                console.log('Profile data received:', response.data);
                setProfile(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching profile:', err);
                // Log detailed error information
                if (err.response) {
                    // The request was made and the server responded with a status code
                    console.error('Response status:', err.response.status);
                    console.error('Response data:', err.response.data);
                } else if (err.request) {
                    // The request was made but no response was received
                    console.error('No response received:', err.request);
                } else {
                    // Something happened in setting up the request
                    console.error('Error message:', err.message);
                }
                setError(err.response?.data?.message || 'Failed to load profile data');
                setLoading(false);
            }
        };

        if (user) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [user, api]);

    if (loading) return <div className="text-center py-8">Loading profile...</div>;
    if (!user) return <div className="text-center py-8">Please log in to view your profile</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-2xl mx-auto">
                <div className="bg-brown-800 text-white px-6 py-4">
                    <h2 className="text-2xl font-bold">User Profile</h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center mb-6">
                        {profile.profilePic ? (
                            <img
                                src={`data:image/jpeg;base64,${profile.profilePic}`}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover mr-6"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-brown-200 flex items-center justify-center text-brown-800 text-3xl font-bold mr-6">
                                {profile.name ? profile.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h3 className="text-xl font-semibold">{profile.name || user.username}</h3>
                            <p className="text-gray-600 capitalize">{user.role}</p>
                            {profile.employeeId && (
                                <p className="text-gray-500 text-sm">Employee ID: {profile.employeeId}</p>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-500 text-sm">Username</p>
                                <p className="font-medium">{profile.username}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Email</p>
                                <p className="font-medium">{profile.email || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Account Type</p>
                                <p className="font-medium capitalize">{user.role}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Member Since</p>
                                <p className="font-medium">April 2025</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <a href="/settings" className="bg-brown-800 text-white px-4 py-2 rounded hover:bg-brown-700 transition-colors">
                            Edit Profile
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
