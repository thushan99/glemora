import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserManagement = () => {
  const { api, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentUserDetails, setCurrentUserDetails] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/employees', {
        headers: { 'X-Api-Version': 'v1' }
      });
      setUsers(response.data);

      // Find and set current user details
      if (user && user.username) {
        const currentUser = response.data.find(u => u.username === user.username);
        if (currentUser) {
          setCurrentUserDetails(currentUser);
        }
      }

      setError('');
    } catch (err) {
      setError('Failed to fetch users: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current user details separately if not in employees list
  const fetchCurrentUserDetails = async () => {
    if (!user || !user.username) return;

    try {
      const response = await api.get('/auth/me', {
        headers: { 'X-Api-Version': 'v1' }
      });
      setCurrentUserDetails(response.data);
    } catch (err) {
      console.error('Failed to fetch current user details:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCurrentUserDetails();
  }, [api, user]);

  // Validation function
  const validateUserData = (userData) => {
    const errors = {};

    if (!userData.name || userData.name.trim() === '') {
      errors.name = 'Name is required';
    }

    if (!userData.email || userData.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!userData.username || userData.username.trim() === '') {
      errors.username = 'Username is required';
    }

    if (isCreating && (!userData.password || userData.password.trim() === '')) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      // Using the user role update endpoint
      await api.put(`/auth/users/${userId}/role`, {
        roleNames: [newRole]
      }, {
        headers: { 'X-Api-Version': 'v1' }
      });

      // Update the UI after successful role change
      const updatedUsers = users.map(user =>
          user.id === userId ? { ...user, roles: [{ name: newRole }] } : user
      );
      setUsers(updatedUsers);

      // Show success message
      setError('User role updated successfully');
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      setError('Failed to update user role: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setIsEditing(false);
    setIsCreating(false);
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setIsCreating(false);
    setEditedUser(null);
    setValidationErrors({});
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Using the delete user endpoint
        await api.delete(`/auth/users/${userId}`, {
          headers: { 'X-Api-Version': 'v1' }
        });

        // Update UI after successful deletion
        setUsers(users.filter(user => user.id !== userId));
        if (selectedUser && selectedUser.id === userId) {
          closeUserDetails();
        }

        // Show success message
        setError('User deleted successfully');
        setTimeout(() => setError(''), 3000);
      } catch (err) {
        setError('Failed to delete user: ' + (err.response?.data?.message || err.message));
        console.error(err);
      }
    }
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    setIsEditing(true);
    setIsCreating(false);
    // Make a deep copy of the selected user to avoid reference issues
    setEditedUser({
      ...selectedUser,
      profilePic: selectedUser.profilePic || null
    });
  };

  const handleCreateUser = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedUser(null);
    setEditedUser({
      name: '',
      email: '',
      username: '',
      password: '',
      roles: [{ name: 'USER' }]
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditedUser(prev => ({
        ...prev,
        profilePic: e.target.files[0]
      }));
    }
  };

  const handleUpdateUser = async () => {
    // Validate form
    const errors = validateUserData(editedUser);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      if (isCreating) {
        // Create new user using the sign-up endpoint
        const userAuthRequestDTO = {
          name: editedUser.name,
          email: editedUser.email,
          username: editedUser.username,
          password: editedUser.password,
          role: [editedUser.role || '1']
        };

        await api.post('/auth/sign-up', userAuthRequestDTO, {
          headers: { 'X-Api-Version': 'v1' }
        });

        // Refresh user list after creating
        await fetchUsers();
        closeUserDetails();

        // Show success message
        setError('User created successfully');
        setTimeout(() => setError(''), 3000);
      } else {
        // Update existing user
        const updateData = new FormData();
        updateData.append('name', editedUser.name);
        updateData.append('email', editedUser.email);
        updateData.append('username', editedUser.username);

        // Check if a profile picture was selected
        if (editedUser.profilePic && editedUser.profilePic instanceof File) {
          updateData.append('profilePic', editedUser.profilePic);
        }

        // Check if the user being edited is the current user
        if (editedUser.id === currentUserDetails?.id || editedUser.username === user?.username) {
          // Updating current user
          await api.put('/auth/update-me', updateData, {
            headers: {
              'X-Api-Version': 'v1',
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          // Updating other user using admin endpoint
          await api.put(`/auth/users/${editedUser.id}`, updateData, {
            headers: {
              'X-Api-Version': 'v1',
              'Content-Type': 'multipart/form-data'
            }
          });
        }

        // Refresh user list
        await fetchUsers();
        closeUserDetails();

        // Show success message
        setError('User updated successfully');
        setTimeout(() => setError(''), 3000);
      }

      setValidationErrors({});
    } catch (err) {
      setError(`Failed to ${isCreating ? 'create' : 'update'} user: ` + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-8">Loading users...</div>;

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>

        {error && (
            <div className={`mb-4 p-4 ${error.includes('Failed') ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'} rounded`}>
              {error}
              <button
                  className="float-right font-bold"
                  onClick={() => setError('')}
              >
                ✕
              </button>
            </div>
        )}

        {/* Display current user info */}
        {currentUserDetails && (
            <div className="mb-6 bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Currently Logged In</h2>
              <div className="flex items-center space-x-4">
                {currentUserDetails.profilePic && (
                    <img
                        src={currentUserDetails.profilePic}
                        alt="Profile"
                        className="h-16 w-16 rounded-full object-cover"
                    />
                )}
                <div>
                  <div className="font-medium text-lg">{currentUserDetails.name || currentUserDetails.username}</div>
                  <div className="text-gray-500">{currentUserDetails.email}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Role: {currentUserDetails.roles?.map(role => role.name).join(', ') || user?.role?.toUpperCase() || 'USER'}
                  </div>
                  <div className="text-sm text-gray-500">ID: {currentUserDetails.id}</div>
                </div>
              </div>
            </div>
        )}

        <div className="mb-4 flex justify-end">
          <button
              onClick={handleCreateUser}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create New User
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
                users.map((userItem) => {
                  // Check if this user is the currently logged-in user
                  const isCurrentUser = userItem.username === user?.username;

                  return (
                      <tr key={userItem.id} className={isCurrentUser ? "bg-blue-50" : ""}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{userItem.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {userItem.name || 'N/A'}
                            {isCurrentUser && (
                                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            You
                          </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{userItem.username}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{userItem.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                              value={userItem.roles?.[0]?.name || 'USER'}
                              onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                              className="text-sm text-gray-900 border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {userItem.updatedAt ? new Date(userItem.updatedAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                              onClick={() => openUserDetails(userItem)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View
                          </button>
                          <button
                              onClick={() => {
                                setSelectedUser(userItem);
                                setTimeout(() => {
                                  handleEditUser();
                                }, 0);
                              }}
                              className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                              onClick={() => handleDeleteUser(userItem.id)}
                              className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                  );
                })
            ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    No users found.
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>

        {/* User Details/Edit/Create Modal */}
        {(selectedUser || isCreating) && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">
                    {isCreating ? 'Create User' : isEditing ? 'Edit User' : 'User Details'}
                  </h2>
                  <button onClick={closeUserDetails} className="text-gray-500 hover:text-gray-700">
                    ✕
                  </button>
                </div>

                {(isEditing || isCreating) ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={editedUser?.name || ''}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full rounded-md border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
                        />
                        {validationErrors.name && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={editedUser?.username || ''}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full rounded-md border ${validationErrors.username ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
                        />
                        {validationErrors.username && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.username}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={editedUser?.email || ''}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full rounded-md border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
                        />
                        {validationErrors.email && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                        <input
                            type="file"
                            name="profilePic"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                        />
                        {editedUser?.profilePic && typeof editedUser.profilePic === 'string' && (
                            <div className="mt-2">
                              <img
                                  src={editedUser.profilePic}
                                  alt="Current profile"
                                  className="h-20 w-20 rounded-full object-cover"
                              />
                              <p className="text-xs text-gray-500 mt-1">Current profile picture</p>
                            </div>
                        )}
                        {editedUser?.profilePic instanceof File && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">New file selected: {editedUser.profilePic.name}</p>
                            </div>
                        )}
                      </div>

                      {isCreating && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={editedUser?.password || ''}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full rounded-md border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
                            />
                            {validationErrors.password && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                            )}
                          </div>
                      )}

                      {isCreating && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                name="role"
                                value={editedUser?.roles?.[0]?.name || 'USER'}
                                onChange={(e) => setEditedUser({...editedUser, roles: [{ name: e.target.value }]})}
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            >
                              <option value="USER">USER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </div>
                      )}
                    </div>
                ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ID</label>
                        <div className="mt-1 text-sm text-gray-900">{selectedUser?.id}</div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <div className="mt-1 text-sm text-gray-900">{selectedUser?.name || 'N/A'}</div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <div className="mt-1 text-sm text-gray-900">{selectedUser?.username}</div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <div className="mt-1 text-sm text-gray-900">{selectedUser?.email}</div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <div className="mt-1 text-sm text-gray-900 capitalize">
                          {selectedUser?.roles?.map(role => role.name).join(', ') || 'USER'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Created At</label>
                        <div className="mt-1 text-sm text-gray-900">
                          {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Updated At</label>
                        <div className="mt-1 text-sm text-gray-900">
                          {selectedUser?.updatedAt ? new Date(selectedUser.updatedAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>

                      {selectedUser?.profilePic && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                            <div className="mt-1">
                              <img
                                  src={selectedUser.profilePic}
                                  alt="Profile"
                                  className="h-20 w-20 rounded-full object-cover"
                              />
                            </div>
                          </div>
                      )}
                    </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  {(isEditing || isCreating) ? (
                      <>
                        <button
                            onClick={closeUserDetails}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                            onClick={handleUpdateUser}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          {isCreating ? 'Create User' : 'Save Changes'}
                        </button>
                      </>
                  ) : (
                      <>
                        <button
                            onClick={handleEditUser}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-2"
                        >
                          Edit
                        </button>
                        <button
                            onClick={() => handleDeleteUser(selectedUser?.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
                        >
                          Delete
                        </button>
                        <button
                            onClick={closeUserDetails}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                        >
                          Close
                        </button>
                      </>
                  )}
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default UserManagement;