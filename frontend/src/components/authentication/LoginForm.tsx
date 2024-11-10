import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isAuthenticated, login } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/files" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data);
      } else {
        window.alert(data.error);
      }
    } catch (error) {
      window.alert(`Login failed: ${error}`);
      console.error('Login failed:', error);
    }

  };

  return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          <div>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full rounded-full border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600" placeholder="Username"
              required
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-full border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600" placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            className="text-xl inline-block border-indigo-800 text-indigo-800 hover:bg-indigo-800 hover:text-white transition-colors px-6 py-2 rounded-full border-2"
            >
            Sign in
          </button>
        </form>
  );
};

export default LoginForm;
