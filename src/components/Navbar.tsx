import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, X, LogIn, LogOut, Package, Heart, LayoutDashboard, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { UserRole } from '../types';

const Navbar = () => {
  const { profile, signIn, logout } = useAuth();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold tracking-tighter text-gray-900">
              AL FAHAD <span className="text-orange-600">TRADERS</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-orange-600">
              <Search size={20} />
            </button>
            <Link to="/cart" className="p-2 text-gray-500 hover:text-orange-600 relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-orange-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {profile ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-gray-500 hover:text-orange-600">
                  <User size={20} />
                  <span className="text-sm font-medium hidden sm:block">{profile.displayName}</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {profile.role === UserRole.ADMIN && (
                    <Link to="/admin" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                      <LayoutDashboard size={16} className="mr-2" /> Admin Panel
                    </Link>
                  )}
                  {profile.role === UserRole.RESELLER && (
                    <Link to="/reseller" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                      <TrendingUp size={16} className="mr-2" /> Reseller Panel
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                    <User size={16} className="mr-2" /> My Profile
                  </Link>
                  <Link to="/profile/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                    <Package size={16} className="mr-2" /> Orders
                  </Link>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-2" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/auth"
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-full hover:bg-orange-700 transition-colors"
              >
                <LogIn size={18} />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Btn */}
            <button 
              className="md:hidden p-2 text-gray-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
