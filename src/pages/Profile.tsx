import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, DollarSign, LogOut, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getOrders } from '../lib/services';
import { Order, UserRole } from '../types';
import { formatCurrency } from '../lib/utils';

const Profile = () => {
  const { profile, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const fetch = async () => {
      const o = await getOrders(profile.uid);
      setOrders(o);
      setLoading(false);
    };
    fetch();
  }, [profile]);

  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="p-8 bg-white rounded-3xl border border-gray-100 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center font-black text-2xl mb-4">
              {profile.displayName.slice(0, 1).toUpperCase()}
            </div>
            <h2 className="text-xl font-black text-gray-900">{profile.displayName}</h2>
            <p className="text-gray-400 text-sm mb-6">{profile.email}</p>
            <div className="px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
              {profile.role}
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-4 text-red-600 font-bold bg-red-50 rounded-2xl hover:bg-red-100 transition-all"
          >
            <LogOut size={20} className="mr-2" /> Sign Out
          </button>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3 space-y-12">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <Award className="text-yellow-500 mb-4" size={32} />
              <div className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Loyalty Points</div>
              <div className="text-3xl font-black">{profile.points}</div>
            </div>
            {profile.role === UserRole.RESELLER && (
              <div className="p-8 bg-orange-600 rounded-3xl text-white shadow-xl shadow-orange-100">
                <DollarSign className="text-orange-200 mb-4" size={32} />
                <div className="text-orange-200 text-xs font-black uppercase tracking-widest mb-1">Commission Balance</div>
                <div className="text-3xl font-black">{formatCurrency(profile.commissionBalance)}</div>
              </div>
            )}
            <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <Package className="text-blue-500 mb-4" size={32} />
              <div className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Total Orders</div>
              <div className="text-3xl font-black">{orders.length}</div>
            </div>
          </div>

          {/* Orders Section */}
          <div>
            <h3 className="text-2xl font-black mb-8">Order History</h3>
            <div className="space-y-6">
              {loading ? (
                <div className="p-12 text-center text-gray-400">Loading your history...</div>
              ) : orders.length > 0 ? (
                orders.map(order => (
                  <div key={order.id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-6">
                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <Package className="text-gray-400" size={24} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Order #{order.id.slice(0, 8)}</div>
                        <div className="text-sm text-gray-400">{new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div className="text-right">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</div>
                        <div className="font-black text-orange-600">{formatCurrency(order.totalAmount)}</div>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 border-2 border-dashed border-gray-100 rounded-[40px] text-center text-gray-400 italic">
                  You haven't placed any orders yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
