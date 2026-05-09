import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  FileText,
  CheckCircle,
  Truck,
  Printer,
  Award
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { getOrders, getProducts, updateOrderStatus } from '../lib/services';
import { Order, Product, OrderStatus } from '../types';
import { formatCurrency } from '../lib/utils';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [o, p] = await Promise.all([getOrders(), getProducts()]);
      setOrders(o);
      setProducts(p);
      setLoading(false);
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(orders.reduce((sum, o) => sum + o.totalAmount, 0)), icon: <TrendingUp className="text-green-600" />, color: 'bg-green-50' },
    { label: 'Orders', value: orders.length, icon: <ShoppingBag className="text-orange-600" />, color: 'bg-orange-50' },
    { label: 'Products', value: products.length, icon: <Package className="text-blue-600" />, color: 'bg-blue-50' },
    { label: 'Low Stock', value: products.filter(p => p.stock <= p.lowStockThreshold).length, icon: <AlertTriangle className="text-red-600" />, color: 'bg-red-50' },
  ];

  // Dummy chart data from orders
  const chartData = orders.slice(0, 7).reverse().map(o => ({
    name: new Date(o.createdAt?.seconds * 1000).toLocaleDateString(),
    sales: o.totalAmount
  }));

  const handlePrintLabel = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Label - ${order.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; }
            .label { border: 2px solid black; padding: 20px; width: 400px; }
            .header { border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 20px; text-align: center; }
            .sender { margin-bottom: 20px; font-size: 14px; }
            .recipient { font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="header">
              <h1>AL FAHAD TRADERS</h1>
              <p>PREMIUM E-COMMERCE</p>
            </div>
            <div class="sender">
              <strong>FROM:</strong><br/>
              Al Fahad Traders<br/>
              123 Trading St, Business District<br/>
              Phone: +1 234 567 890
            </div>
            <div class="recipient">
              <strong>TO:</strong><br/>
              ${order.customerName}<br/>
              ${order.shippingAddress.street}<br/>
              ${order.shippingAddress.city}, ${order.shippingAddress.zip}<br/>
              ${order.customerEmail}
            </div>
            <div style="margin-top: 20px; font-weight: bold;">
              TOTAL AMOUNT: Rs. ${order.totalAmount.toFixed(2)}
            </div>
            <div style="margin-top: 20px; text-align: center;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${order.id}" />
              <p>ORDER ID: ${order.id}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handlePrintPostOfficeForm = (order: Order) => {
     // Similar logic for Post Office Form
     const printWindow = window.open('', '_blank');
     if (!printWindow) return;
     printWindow.document.write(`
       <html>
         <head><title>Money Order Form</title></head>
         <style>
            body { font-family: serif; padding: 50px; line-height: 2; }
            .form { border: 1px solid #ccc; padding: 40px; max-width: 800px; margin: auto; }
            .field { border-bottom: 1px dotted black; display: inline-block; min-width: 200px; margin-right: 10px; }
         </style>
         <body>
           <div class="form">
             <h2 style="text-align:center">POST OFFICE MONEY ORDER FORM</h2>
             <p>Sender Name: <span class="field">Al Fahad Traders</span></p>
             <p>Sender Address: <span class="field">123 Trading Hub, City A, 44000</span></p>
             <p>Recipient Name: <span class="field">${order.customerName}</span></p>
             <p>Recipient Address: <span class="field">${order.shippingAddress.street}, ${order.shippingAddress.city}</span></p>
             <p>Amount in Figures: <span class="field">PKR ${order.totalAmount.toFixed(2)}</span></p>
             <p>Payment Method: <span class="field">Cash on Delivery</span></p>
             <p>Customer Signature: <span class="field">____________________</span></p>
           </div>
         </body>
       </html>
     `);
     printWindow.document.close();
     printWindow.print();
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col pt-8">
        <div className="px-6 mb-12">
          <h2 className="text-xl font-black tracking-tighter">ADMIN <span className="text-orange-600">PANEL</span></h2>
        </div>
        <nav className="flex-grow space-y-1 px-4">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'overview' ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'}`}
          >
            <LayoutDashboard size={20} className="mr-3" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'orders' ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'}`}
          >
            <ShoppingBag size={20} className="mr-3" /> Orders
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'products' ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'}`}
          >
            <Package size={20} className="mr-3" /> Inventory
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'users' ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'}`}
          >
            <Users size={20} className="mr-3" /> Customers
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'reports' ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'}`}
          >
            <FileText size={20} className="mr-3" /> Reports
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-auto p-12">
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-2">Check your sales performance and inventory status.</p>
              </div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Last Updated: {new Date().toLocaleTimeString()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
                  <div className={`p-4 rounded-2xl ${s.color}`}>{s.icon}</div>
                  <div>
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">{s.label}</h3>
                    <p className="text-2xl font-black text-gray-900">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-[400px]">
                <h3 className="text-lg font-bold mb-8">Sales Velocity</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" fontSize={11} fontWeight={600} stroke="#9CA3AF" />
                    <YAxis fontSize={11} fontWeight={600} stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                      cursor={{ fill: '#FFF7ED' }}
                    />
                    <Bar dataKey="sales" fill="#EA580C" radius={[8, 8, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 border-b border-gray-50">
                  <h3 className="text-lg font-bold">Recent Low Stock Alerts</h3>
                </div>
                <div className="flex-grow overflow-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <th className="px-8 py-4">Product</th>
                        <th className="px-8 py-4 text-center">Stock</th>
                        <th className="px-8 py-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.filter(p => p.stock <= p.lowStockThreshold).map(p => (
                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-8 py-5 font-bold text-gray-900">{p.name}</td>
                          <td className="px-8 py-5 text-center font-black">{p.stock}</td>
                          <td className="px-8 py-5 text-right">
                            <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black rounded-full uppercase">CRITICAL</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Manage Orders</h1>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-black uppercase tracking-widest text-gray-400">
                    <th className="px-8 py-5">Order ID</th>
                    <th className="px-8 py-5">Customer</th>
                    <th className="px-8 py-5">Total</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 font-bold text-gray-900">#{order.id.slice(0, 8)}</td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-400">{order.customerEmail}</div>
                      </td>
                      <td className="px-8 py-6 font-black text-green-600">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-8 py-6">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight border-none focus:ring-2 focus:ring-orange-500 shadow-sm ${
                            order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700' : 
                            order.status === OrderStatus.SHIPPED ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}
                        >
                          <option value={OrderStatus.PENDING}>Pending</option>
                          <option value={OrderStatus.PROCESSING}>Processing</option>
                          <option value={OrderStatus.SHIPPED}>Shipped</option>
                          <option value={OrderStatus.DELIVERED}>Delivered</option>
                          <option value={OrderStatus.CANCELLED}>Cancelled</option>
                        </select>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        <button 
                          onClick={() => handlePrintLabel(order)}
                          className="p-2.5 bg-gray-100 text-gray-400 hover:bg-orange-600 hover:text-white rounded-xl transition-all"
                          title="Print Shipping Label"
                        >
                          <Truck size={18} />
                        </button>
                        <button 
                          onClick={() => handlePrintPostOfficeForm(order)}
                          className="p-2.5 bg-gray-100 text-gray-400 hover:bg-orange-600 hover:text-white rounded-xl transition-all"
                          title="Print Money Order Form"
                        >
                          <Printer size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Manage Customers</h1>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-black uppercase tracking-widest text-gray-400">
                    <th className="px-8 py-5">User</th>
                    <th className="px-8 py-5">Role</th>
                    <th className="px-8 py-5">Points</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* Mocking user list as we don't have a listUsers service yet, usually done via admin SDK or a collection query if public enough */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-bold text-gray-900">Sidra Khalid</div>
                      <div className="text-xs text-gray-400">sidra2000khalid@gmail.com</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-black rounded-full uppercase">Admin</span>
                    </td>
                    <td className="px-8 py-6 font-black">1250</td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-orange-600 font-bold text-sm hover:underline">Edit Role</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-12">
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Sales Reports</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 bg-white rounded-[40px] border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold">Reseller Performance</h3>
                  <Award className="text-orange-600" />
                </div>
                <div className="space-y-6">
                  {orders.filter(o => o.isResellerOrder).slice(0, 5).map((o, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center font-bold text-orange-600 text-xs text-center">{o.customerName[0]}</div>
                        <div>
                          <p className="font-bold text-sm">{o.customerName}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-black">Commission: {formatCurrency(o.commissionAmount || 0)}</p>
                        </div>
                      </div>
                      <div className="font-black">{formatCurrency(o.totalAmount)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-10 bg-gray-900 rounded-[40px] text-white">
                <h3 className="text-lg font-bold mb-8">Inventory Snapshot</h3>
                <div className="space-y-6">
                   <div className="flex justify-between items-center text-sm font-bold">
                     <span className="text-gray-400 uppercase tracking-widest text-[10px]">Total Assets Value</span>
                     <span className="text-xl">{formatCurrency(products.reduce((sum, p) => sum + (p.price * p.stock), 0))}</span>
                   </div>
                   <div className="pt-6 border-t border-white/10 space-y-4 text-sm">
                      {products.slice(0, 5).map(p => (
                        <div key={p.id} className="flex justify-between">
                          <span className="text-gray-400">{p.name}</span>
                          <span className="font-bold">{p.stock} units</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
