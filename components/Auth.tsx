import React, { useState } from 'react';
import { 
  UserCircleIcon, 
  LockClosedIcon, 
  EnvelopeIcon, 
  EyeIcon, 
  EyeSlashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface AuthProps {
  onLogin: (email: string) => void;
  onClose: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const storedUsers = localStorage.getItem('app_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    if (isLogin) {
      // Login Logic
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (user) {
        onLogin(email);
      } else {
        setError("Invalid email or password. Please check your credentials.");
      }
    } else {
      // Signup Logic
      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        setError("User already exists. Please login.");
        return;
      }

      const newUser = { email, password };
      users.push(newUser);
      localStorage.setItem('app_users', JSON.stringify(users));
      
      // Automatically login after signup
      onLogin(email);
    }
  };

  return (
    <div className="bg-white w-full rounded-2xl shadow-2xl overflow-hidden relative">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10 p-1 hover:bg-slate-100 rounded-full transition-colors"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      <div className="p-8 pb-6 text-center bg-slate-50 border-b border-slate-100">
        <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
          <UserCircleIcon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          {isLogin ? 'Enter your credentials to continue.' : 'Sign up to save your progress.'}
        </p>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-200">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
                setShowPassword(false);
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;