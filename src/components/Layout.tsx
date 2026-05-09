import React from 'react';
import Navbar from './Navbar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16 pb-20">
        {children}
      </main>
      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-xl font-bold tracking-tighter text-gray-900 mb-4">
                AL FAHAD <span className="text-orange-600">TRADERS</span>
              </h2>
              <p className="text-gray-500 text-sm max-w-xs mb-6">
                Your one-stop shop for premium products. Quality, trust, and excellence in every delivery.
              </p>
              <div className="flex space-x-4">
                {/* Social icons placeholder */}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/shop" className="hover:text-orange-600">Shop All</a></li>
                <li><a href="/resellers" className="hover:text-orange-600">Reseller Program</a></li>
                <li><a href="/support" className="hover:text-orange-600">Customer Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Account</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/profile" className="hover:text-orange-600">My Profile</a></li>
                <li><a href="/profile/orders" className="hover:text-orange-600">Order History</a></li>
                <li><a href="/profile/wishlist" className="hover:text-orange-600">Wishlist</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Al Fahad Traders. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
