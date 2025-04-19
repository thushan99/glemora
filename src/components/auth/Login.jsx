import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Input validation
    if (!username.trim() || !password.trim()) {
      setError('Username and password cannot be empty');
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(username, password);

      if (success) {
        // Get the user role from localStorage
        const userRole = localStorage.getItem('userRole');

        // Navigate based on user role
        switch (userRole) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'manager':
            navigate('/manager/dashboard');
            break;
          case 'user':
            navigate('/user/dashboard');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-brown-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-brown-200 p-8 rounded-lg shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-brown-800">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-brown-300 placeholder-brown-500 text-brown-900 rounded-t-md focus:outline-none focus:ring-brown-500 focus:border-brown-500 focus:z-10 sm:text-sm"
                    placeholder="Username"
                    disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-brown-300 placeholder-brown-500 text-brown-900 rounded-b-md focus:outline-none focus:ring-brown-500 focus:border-brown-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    disabled={isLoading}
                />
              </div>
            </div>

            {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
            )}

            <div>
              <button
                  type="submit"
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brown-800 hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500 ${
                      isLoading
                          ? 'bg-brown-400 cursor-not-allowed'
                          : 'bg-brown-600 hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500'
                  }`}
                  disabled={isLoading}
              >
                {isLoading ? (
                    <div className="flex items-center">
                      <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                      >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing In...
                    </div>
                ) : (
                    'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="text-center space-y-2">
            <Link
                to="/register"
                className="font-medium text-brown-600 hover:text-brown-500 block"
            >
              Don't have an account? Register
            </Link>
            <Link
                to="/forgot-password"
                className="text-sm text-brown-500 hover:text-brown-600 block"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
  );
};

export default Login;