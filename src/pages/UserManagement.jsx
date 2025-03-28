import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Simulate fetching users with dummy data
  useEffect(() => {
    const fetchUsers = () => {
      try {
        const dummyUsers = [
          {
            id: '1',
            displayName: 'John Doe',
            email: 'john.doe@example.com',
            role: 'customer',
            createdAt: new Date('2022-01-01')
          },
          {
            id: '2',
            displayName: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'admin',
            createdAt: new Date('2021-06-15')
          },
          {
            id: '3',
            displayName: 'Sam Johnson',
            email: 'sam.johnson@example.com',
            role: 'staff',
            createdAt: new Date('2023-02-10')
          }
        ];

        setUsers(dummyUsers);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Validation function
  const validateUserData = (userData) => {
    const errors = {};

    if (!userData.displayName || userData.displayName.trim() === '') {
      errors.displayName = 'Name is required';
    }

    if (!userData.email || userData.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!userData.role || userData.role.trim() === '') {
      errors.role = 'Role is required';
    }

    return errors;
  };

  const handleRoleChange = (userId, newRole) => {
    try {
      setUsers(users.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      setError('Failed to update user role');
      console.error(err);
    }
  };

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setIsEditing(false);
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setEditedUser(null);
    setValidationErrors({});
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // In a real app, you would call an API endpoint here
        setUsers(users.filter(user => user.id !== userId));
        if (selectedUser && selectedUser.id === userId) {
          closeUserDetails();
        }
      } catch (err) {
        setError('Failed to delete user');
        console.error(err);
      }
    }
  };

  const handleEditUser = () => {
    setIsEditing(true);
    setEditedUser({...selectedUser});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateUser = () => {
    // Validate form
    const errors = validateUserData(editedUser);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      // In a real app, you would call an API endpoint here
      setUsers(users.map(user =>
          user.id === editedUser.id ? editedUser : user
      ));
      setSelectedUser(editedUser);
      setIsEditing(false);
      setValidationErrors({});
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-8">Loading users...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
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
            {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.displayName || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="text-sm text-gray-900 border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-brown-500 focus:border-brown-500"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.createdAt.toLocaleDateString() || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                        onClick={() => openUserDetails(user)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button
                        onClick={() => {
                          setSelectedUser(user);
                          handleEditUser();
                        }}
                        className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* User Details/Edit Modal */}
        {selectedUser && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">
                    {isEditing ? 'Edit User' : 'User Details'}
                  </h2>
                  <button onClick={closeUserDetails} className="text-gray-500 hover:text-gray-700">
                    ✕
                  </button>
                </div>

                {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="displayName"
                            value={editedUser.displayName || ''}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full rounded-md border ${validationErrors.displayName ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
                        />
                        {validationErrors.displayName && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.displayName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={editedUser.email || ''}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full rounded-md border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
                        />
                        {validationErrors.email && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            name="role"
                            value={editedUser.role || ''}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full rounded-md border ${validationErrors.role ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
                        >
                          <option value="">Select Role</option>
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                          <option value="staff">Staff</option>
                        </select>
                        {validationErrors.role && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.role}</p>
                        )}
                      </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ID</label>
                        <div className="mt-1 text-sm text-gray-900">{selectedUser.id}</div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <div className="mt-1 text-sm text-gray-900">{selectedUser.displayName || 'N/A'}</div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <div className="mt-1 text-sm text-gray-900">{selectedUser.email}</div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <div className="mt-1 text-sm text-gray-900 capitalize">{selectedUser.role}</div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Created At</label>
                        <div className="mt-1 text-sm text-gray-900">
                          {selectedUser.createdAt.toLocaleDateString() || 'N/A'}
                        </div>
                      </div>
                    </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  {isEditing ? (
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
                          Save Changes
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
                            onClick={() => handleDeleteUser(selectedUser.id)}
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