import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown, Search } from 'lucide-react';
import { getProducts } from '../lib/services';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { formatCurrency } from '../lib/utils';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  const categories = ['All', 'Watches', 'Audio', 'Accessories', 'Home Office'];

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await getProducts(activeCategory === 'All' ? undefined : activeCategory);
      const filtered = data.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
      setProducts(filtered);
      setLoading(false);
    };
    fetch();
  }, [activeCategory, priceRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-8 shrink-0">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6 flex items-center">
              <Filter size={16} className="mr-2" /> Categories
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === cat 
                      ? 'bg-orange-600 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6 flex items-center">
              <SlidersHorizontal size={16} className="mr-2" /> Price Range
            </h3>
            <div className="px-2">
              <input 
                type="range" 
                min="0" 
                max="100000" 
                step="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span>Rs. 0</span>
                <span>{formatCurrency(priceRange[1])}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeCategory} Products
              <span className="ml-3 text-sm font-normal text-gray-400">({products.length} Items)</span>
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Sort by:</span>
              <button className="font-medium text-gray-900 flex items-center">
                Newest <ChevronDown size={16} className="ml-1" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl aspect-square animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Search size={48} className="mb-4 opacity-20" />
              <p>No products found in this range.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
