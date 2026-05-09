import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  Package, 
  Share2, 
  TrendingUp, 
  Users, 
  Wallet,
  ArrowUpRight,
  ExternalLink,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { getOrders, getProducts } from '../lib/services';
import { Order, Product, UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../lib/utils';
import ProductCard from '../components/ProductCard';

const ResellerPanel = () => {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    const fetchData = async () => {
      setLoading(true);
      const [allOrders, allProducts] = await Promise.all([
        getOrders(profile.uid), // Resellers see their own referred orders
        getProducts()
      ]);
      setOrders(allOrders.filter(o => o.isResellerOrder));
      setProducts(allProducts);
      setLoading(false);
    };
    fetchData();
  }, [profile]);

  const copyToClipboard = (productId: string) => {
    const url = `${window.location.origin}/product/${productId}?ref=${profile?.uid}`;
    navigator.clipboard.writeText(url);
    setCopiedId(productId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const stats = [
    { label: 'Total Earnings', value: formatCurrency(profile?.commissionBalance || 0), icon: <Wallet className="text-orange-600" />, color: 'bg-orange-50' },
    { label: 'Total Sales', value: orders.length, icon: <TrendingUp className="text-green-600" />, color: 'bg-green-50' },
    { label: 'Conversion Rate', value: '4.2%', icon: <Users className="text-blue-600" />, color: 'bg-blue-50' },
    { label: 'Avg. Commission', value: '10%', icon: <DollarSign className="text-purple-600" />, color: 'bg-purple-50' },
  ];

  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  if (loading) return <div className="p-20 text-center">Loading Reseller Data...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center">
            Reseller Panel <span className="ml-4 px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-black uppercase rounded-full tracking-widest">Enterprise</span>
          </h1>
          <p className="text-gray-500 mt-2">Manage your referrals, track commissions, and promote top products.</p>
        </div>
        <button className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all flex items-center space-x-2">
          <DollarSign size={20} />
          <span>Request Payout</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between h-full">
            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-6`}>
              {stat.icon}
            </div>
            <div>
              <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</h3>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-lg font-bold">Earnings Statistics</h3>
            <select className="bg-gray-50 border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-orange-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#EA580C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                  dataKey="name" 
                  fontSize={11} 
                  fontWeight={800} 
                  stroke="#9CA3AF" 
                  axisLine={false} 
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  fontSize={11} 
                  fontWeight={800} 
                  stroke="#9CA3AF" 
                  axisLine={false} 
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#EA580C" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Links / Promo */}
        <div className="bg-orange-600 rounded-[40px] p-8 text-white flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <Share2 size={24} />
            </div>
            <h3 className="text-2xl font-black mb-4 leading-tight">Your Reseller <br/>Identity</h3>
            <p className="text-orange-100 text-sm opacity-80 leading-relaxed mb-8">
              Share your unique referral links with your network. Every purchase made through your link earns you a 10% commission instantly.
            </p>
          </div>
          <div className="bg-white/10 rounded-3xl p-6 border border-white/10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Referral ID</p>
            <div className="flex items-center justify-between font-mono font-bold">
              <span>{profile?.uid.slice(0, 12)}...</span>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Promotion Center */}
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Promotion Center</h2>
            <p className="text-gray-500 mt-2">Get high-converting links for trending products.</p>
          </div>
          <a href="/shop" className="text-sm font-bold text-orange-600 hover:underline">View All Products</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map(product => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center p-6 backdrop-blur-[2px]">
                <button 
                  onClick={() => copyToClipboard(product.id)}
                  className="w-full py-3 bg-white text-gray-900 font-bold rounded-xl mb-3 hover:bg-orange-50 transition-colors flex items-center justify-center space-x-2"
                >
                  {copiedId === product.id ? (
                    <>
                      <CheckCircle2 size={18} className="text-green-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      <span>Promote Link</span>
                    </>
                  )}
                </button>
                <button className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
                  <ExternalLink size={18} />
                  <span>Preview Page</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Commissions */}
      <div className="mt-20">
        <h2 className="text-2xl font-black text-gray-900 mb-8">Recent Commissions</h2>
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="px-8 py-5">Order Date</th>
                <th className="px-8 py-5">Product Details</th>
                <th className="px-8 py-5 text-center">Commission</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length > 0 ? orders.map(order => (
                <tr key={order.id} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-bold text-gray-900">{new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}</div>
                    <div className="text-[10px] text-gray-400">ID: #{order.id.slice(0, 8)}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Package size={18} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="font-bold text-sm tracking-tight">{order.items[0]?.name || 'Bulk Order'}</p>
                        <p className="text-[10px] text-gray-400">Total Value: {formatCurrency(order.totalAmount)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="font-black text-green-600">+{formatCurrency(order.commissionAmount || 0)}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-black rounded-full uppercase">Earned</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-400 italic">
                    Start promoting products to see your commissions here!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResellerPanel;
