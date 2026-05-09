import React from 'react';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Star } from 'lucide-react';
import { motion } from 'motion/react';

const Home = () => {
  const categories = [
    { name: 'Watches', icon: '⌚', count: 12 },
    { name: 'Audio', icon: '🎧', count: 24 },
    { name: 'Accessories', icon: '👜', count: 18 },
    { name: 'Electronics', icon: '💻', count: 32 },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600" 
            className="w-full h-full object-cover brightness-50"
            alt="Hero background"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Excellence in <br />
              <span className="text-orange-500">Every Detail.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 font-light">
              Discover a curated collection of premium products, from luxury watches to cutting-edge electronics. Al Fahad Traders - where quality meets trust.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a 
                href="/shop" 
                className="inline-flex items-center justify-center px-8 py-4 bg-orange-600 text-white font-semibold rounded-full hover:bg-orange-700 transition-all text-lg group"
              >
                Shop Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="/resellers" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all text-lg"
              >
                Become a Reseller
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: <Truck className="text-orange-600" size={32} />, title: "Secure Delivery", desc: "Fast and reliable shipping with Cash on Delivery options." },
            { icon: <ShieldCheck className="text-orange-600" size={32} />, title: "Genuine Quality", desc: "All products undergo rigorous quality checks before shipment." },
            { icon: <RefreshCw className="text-orange-600" size={32} />, title: "Easy Returns", desc: "Hassle-free 30-day return policy for peace of mind." }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="mb-6 p-4 bg-orange-50 rounded-2xl">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
              <p className="text-gray-500 mt-2">Explore our diverse range of products</p>
            </div>
            <a href="/shop" className="text-orange-600 font-semibold hover:underline hidden sm:block">View All Categories</a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.a
                key={i}
                href={`/shop?category=${cat.name}`}
                whileHover={{ scale: 1.02 }}
                className="group relative flex flex-col items-center justify-center p-10 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all"
              >
                <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <h3 className="font-bold text-gray-900 group-hover:text-orange-600">{cat.name}</h3>
                <span className="text-xs text-gray-400 mt-1">{cat.count} Items</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Star className="mx-auto text-orange-600 mb-8" size={48} fill="currentColor" />
        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8 italic text-gray-800">
          "Our mission is to provide high-quality products that enhance the lifestyle of our customers."
        </h2>
        <div className="flex flex-col items-center">
          <span className="font-bold text-lg">Al Fahad</span>
          <span className="text-gray-500 text-sm">Founder of Al Fahad Traders</span>
        </div>
      </section>
    </div>
  );
};

export default Home;
