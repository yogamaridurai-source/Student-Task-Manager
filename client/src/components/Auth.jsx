import React, { useState } from 'react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // எண்ட் பாயிண்ட் முகவரியைத் தீர்மானிக்கிறது
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { email, password } : { name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      
      if (onLogin) {
        onLogin(data.token, data.user || { name: name || "Developer Guest" });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020813] px-4">
      <div className="max-w-md w-full bg-[#090f1c] border border-gray-800 p-8 rounded-xl shadow-2xl space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-white">EduPulse</h2>
          <p className="text-sm text-gray-400 mt-1">
            {isLogin ? 'Sign in to access your dashboard' : 'Create a mockup student gateway profile'}
          </p>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-200 p-2.5 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-bold">Full Name</label>
              <input
                type="text"
                className="w-full bg-[#0d1527] border border-gray-700 rounded p-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                placeholder="karthika"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-bold">Email Address</label>
            <input
              type="email"
              className="w-full bg-[#0d1527] border border-gray-700 rounded p-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-bold">Secure Token Key (Password)</label>
            <input
              type="password"
              className="w-full bg-[#0d1527] border border-gray-700 rounded p-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded text-sm transition-colors duration-200 mt-2"
          >
            Execute Setup
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            className="text-xs text-indigo-400 hover:underline"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            {isLogin ? "Don't have an account? Register Instead" : 'Already configured? Sign In Instead'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;