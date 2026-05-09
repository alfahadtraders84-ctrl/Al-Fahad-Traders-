import React from 'react';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../lib/utils';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="text-orange-600" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <a 
          href="/shop" 
          className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-orange-600 transition-all"
        >
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({totalItems})</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center space-x-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-24 h-24 object-cover rounded-2xl bg-gray-50"
              />
              <div className="flex-grow">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                <div className="text-orange-600 font-bold mb-4">{formatCurrency(item.price)}</div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-2 hover:bg-gray-50 text-gray-500"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 font-bold text-gray-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-2 hover:bg-gray-50 text-gray-500"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-gray-300 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="text-right font-bold text-gray-900 text-xl">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold tracking-tighter">FREE</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-orange-600">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
            <a 
              href="/checkout" 
              className="w-full inline-flex items-center justify-center px-8 py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200"
            >
              Checkout <ArrowRight size={20} className="ml-2" />
            </a>
            <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-400 font-medium uppercase tracking-widest">
              <span>Secure Checkout</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span>Free Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
