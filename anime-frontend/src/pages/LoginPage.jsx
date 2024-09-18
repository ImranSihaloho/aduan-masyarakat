import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/api';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      if (response.data.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">Login</h1>
        {error && (
          <p className="mb-4 text-red-500 text-center">{error}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-200 font-semibold">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-200 font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          Belum punya akun? <a href="/register" className="text-blue-500 hover:underline">Daftar sekarang</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage; // Pastikan ekspor default ada di sini
