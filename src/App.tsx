/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import ResellerPanel from './pages/ResellerPanel';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types';
import ProductDetail from './pages/ProductDetail';
import SupportChat from './components/SupportChat';
import { useStoreData } from './lib/initData';

function AppContent() {
  useStoreData();
  
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/orders" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute role={UserRole.ADMIN}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reseller/*" 
            element={
              <ProtectedRoute role={UserRole.RESELLER}>
                <ResellerPanel />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <SupportChat />
      </Layout>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
