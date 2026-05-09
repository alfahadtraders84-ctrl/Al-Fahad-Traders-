import React from 'react';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../lib/utils';

import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col"
    >
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex flex-col space-y-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <div className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-orange-600">
            <Eye size={18} />
          </div>
        </div>
        {product.stock <= product.lowStockThreshold && product.stock > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Low Stock
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
            <span className="text-white font-bold text-lg uppercase tracking-widest">Out of Stock</span>
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className="block group/title">
          <div className="mb-2 text-[10px] font-bold text-orange-600 uppercase tracking-widest">
            {product.category}
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[40px] group-hover/title:text-orange-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center mb-4">
          <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                className={i < Math.floor(product.rating) ? "" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-[11px] text-gray-500 ml-2">({product.reviewsCount})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
            {formatCurrency(product.price)}
          </div>
          <button
            disabled={product.stock === 0}
            onClick={() => addToCart(product)}
            className="p-2.5 bg-gray-900 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-gray-900 transition-colors"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
