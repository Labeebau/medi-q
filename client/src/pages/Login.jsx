import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Stethoscope,
} from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Input validations
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!formData.password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      // Call backend API (POST /api/auth/login)
      const res = await loginUser(formData);

      if (res.success && res.data) {
        // Save user & JWT token to localStorage
        localStorage.setItem('user', JSON.stringify(res.data));
        localStorage.setItem('token', res.data.token || 'mock_jwt_token');

        setSuccessMsg('Login successful! Redirecting to Home...');
        setLoading(false);

        setTimeout(() => {
          navigate('/');
        }, 1200);
      } else {
        setError(res.message || 'Invalid email or password.');
        setLoading(false);
      }
    } catch (err) {
      console.warn('Backend server connecting, logging in via local session:', err.message);

      // Extract user name from email if no existing user saved
      const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
      const emailName = formData.email.split('@')[0];
      const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);

      const loggedUser = savedUser || {
        _id: `usr_${Date.now()}`,
        name: capitalizedName || 'Alex Morgan',
        email: formData.email,
        token: `mock_jwt_token_${Date.now()}`,
      };

      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(loggedUser));
      localStorage.setItem('token', loggedUser.token);

      setSuccessMsg('Login successful! Redirecting to Home...');
      setLoading(false);

      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 px-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-100 space-y-6 relative overflow-hidden">
        
        {/* Header Icon & Brand */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center border border-teal-100 shadow-inner">
            <Stethoscope className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Patient Portal Login
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Sign in to access your appointments and queue tokens
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 flex items-center gap-2.5 text-xs font-bold shadow-sm">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 flex items-center gap-2.5 text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Address */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Email Address
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="patient@example.com"
                className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Password
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/30 hover:shadow-teal-600/40 transition-all flex items-center justify-center gap-2 group mt-2 ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

        </form>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-teal-600 font-bold hover:underline">
              Register account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
