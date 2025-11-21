import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (email: string, role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }

    let role = UserRole.GUEST;
    if (email.endsWith('nits.ac.in') || email.endsWith('institute.edu')) { // Mock domain check
      role = UserRole.MEMBER;
    }
    
    // Admin Override for demo
    if (email.startsWith('admin')) {
      role = UserRole.ADMIN;
    }

    onLogin(email, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Campus<span className="text-brand-600">GPT</span></h1>
          <p className="text-slate-500">Your AI-powered campus companion</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@nits.ac.in or guest@gmail.com"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
          >
            Continue
          </button>

          <div className="bg-blue-50 p-4 rounded-lg text-xs text-blue-800 border border-blue-100">
            <p className="font-semibold mb-1">Demo Credentials:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Use <b>@nits.ac.in</b> for Student/Faculty access (Full Access).</li>
              <li>Use any other email for Guest access (Public Info Only).</li>
              <li>Use <b>admin@nits.ac.in</b> for Admin access.</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;