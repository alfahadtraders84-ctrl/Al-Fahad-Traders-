import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, MapPin, CreditCard, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../lib/services';
import { OrderStatus, Address } from '../types';
import { formatCurrency } from '../lib/utils';
import confetti from 'canvas-confetti';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: profile?.displayName || '',
    email: profile?.email || '',
    street: '',
    city: '',
    zip: '',
    paymentMethod: 'cod' as 'cod' | 'card'
  });

  const handlePlaceOrder = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const address: Address = {
        id: Math.random().toString(36).substring(7),
        name: formData.name,
        street: formData.street,
        city: formData.city,
        state: '',
        zip: formData.zip,
        phone: '',
        isDefault: true
      };

      await createOrder({
        userId: user.uid,
        items,
        totalAmount: totalPrice,
        status: OrderStatus.PENDING,
        shippingAddress: address,
        paymentMethod: formData.paymentMethod,
        customerName: formData.name,
        customerEmail: formData.email,
        isResellerOrder: profile?.role === 'reseller',
        commissionAmount: profile?.role === 'reseller' ? totalPrice * 0.1 : 0 // 10% commission
      });

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EA580C', '#000000', '#FDE047']
      });

      setSuccess(true);
      clearCart();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-green-100"
        >
          <CheckCircle2 className="text-green-600" size={48} />
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Order Successful!</h1>
        <p className="text-gray-500 mb-12 text-lg">Thank you for shopping with Al Fahad Traders. We've received your order and will notify you as soon as it ships.</p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <a href="/shop" className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all">Continue Shopping</a>
          <a href="/profile/orders" className="px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all">Track Order</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-12 flex items-center">
          Checkout <ChevronRight size={24} className="mx-4 text-gray-300" /> 
          <span className={step === 1 ? 'text-orange-600' : 'text-gray-400'}>Shipping</span>
          <ChevronRight size={24} className="mx-4 text-gray-300" />
          <span className={step === 2 ? 'text-orange-600' : 'text-gray-400'}>Payment</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><MapPin size={20} /></div>
                    <h2 className="text-xl font-bold">Shipping Information</h2>
                  </div>
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                    <input 
                      type="email" 
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                    <input 
                      type="text" 
                      placeholder="Street Address"
                      onChange={e => setFormData({...formData, street: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="City"
                        onChange={e => setFormData({...formData, city: e.target.value})}
                        className="px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                      />
                      <input 
                        type="text" 
                        placeholder="ZIP Code"
                        onChange={e => setFormData({...formData, zip: e.target.value})}
                        className="px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => setStep(2)}
                    disabled={!formData.name || !formData.street}
                    className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all disabled:opacity-50"
                  >
                    Continue to Payment
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><CreditCard size={20} /></div>
                    <h2 className="text-xl font-bold">Payment Method</h2>
                  </div>
                  <div className="space-y-4">
                    <label className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all cursor-pointer ${formData.paymentMethod === 'cod' ? 'border-orange-600 bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <div className="flex items-center">
                        <Truck size={24} className="mr-4 text-gray-500" />
                        <div>
                          <p className="font-bold">Cash on Delivery</p>
                          <p className="text-sm text-gray-500">Pay when you receive the order</p>
                        </div>
                      </div>
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={formData.paymentMethod === 'cod'}
                        onChange={() => setFormData({...formData, paymentMethod: 'cod'})}
                        className="w-5 h-5 accent-orange-600" 
                      />
                    </label>
                  </div>
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 bg-white text-gray-900 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="flex-[2] py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200"
                    >
                      {loading ? 'Processing...' : `Pay ${formatCurrency(totalPrice)}`}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold mb-6">Order Summary</h3>
              <div className="space-y-4 max-h-[400px] overflow-auto pr-2 mb-6">
                {items.map(item => (
                  <div key={item.productId} className="flex space-x-4">
                    <img src={item.imageUrl} className="w-16 h-16 rounded-xl object-cover bg-gray-50" />
                    <div className="flex-grow">
                      <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                      <p className="text-orange-600 text-sm font-bold">{formatCurrency(item.price)} x {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-gray-100 space-y-4 font-medium text-gray-600">
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Calculated at next step</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total Due</span>
                  <span className="text-orange-600">{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
