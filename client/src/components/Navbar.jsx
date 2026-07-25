import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Stethoscope, Calendar, LogOut, Menu, X, Home as HomeIcon } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      console.log('User logged out');
      setIsMobileMenuOpen(false);
      navigate('/login');
    }
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform duration-300">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight">Medi-</span>
              <span className="text-xl font-black text-teal-600">Q</span>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest -mt-1">Healthcare</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive('/')
                  ? 'bg-teal-50 text-teal-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HomeIcon className="w-4 h-4 text-teal-600" />
              <span>Home</span>
            </Link>

            <Link
              to="/my-appointments"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive('/my-appointments') || isActive('/book-appointment')
                  ? 'bg-teal-50 text-teal-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Appointments</span>
            </Link>
          </nav>

          {/* Desktop Logout Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/70 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-teal-600" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Responsive Hamburger Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-fade-in shadow-xl">
          <Link
            to="/"
            onClick={closeMenu}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              isActive('/')
                ? 'bg-teal-50 text-teal-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <HomeIcon className="w-5 h-5 text-teal-600" />
            <span>Home</span>
          </Link>

          <Link
            to="/my-appointments"
            onClick={closeMenu}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              isActive('/my-appointments')
                ? 'bg-teal-50 text-teal-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-5 h-5 text-teal-600" />
            <span>Appointments</span>
          </Link>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
