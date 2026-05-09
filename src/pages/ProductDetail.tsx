import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart, Shield, Truck, RotateCcw, Heart, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getProduct, getReviews, addReview } from '../lib/services';
import { Product, Review } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../lib/utils';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { addToCart } = useCart();
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const p = await getProduct(id);
      const r = await getReviews(id);
      setProduct(p);
      setReviews(r);
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    try {
      await addReview({
        productId: id,
        userId: user.uid,
        userName: profile?.displayName || 'Anonymous',
        rating,
        comment
      });
      const updated = await getReviews(id);
      setReviews(updated);
      setComment('');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading product...</div>;
  if (!product) return <div className="p-20 text-center">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        {/* Gallery */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="space-y-4"
        >
          <div className="aspect-square bg-gray-50 rounded-[40px] overflow-hidden border border-gray-100">
            <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
          </div>
        </motion.div>

        {/* Details */}
        <div className="space-y-8">
          <div>
            <div className="text-sm font-black text-orange-600 uppercase tracking-widest mb-4">
              {product.category}
            </div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-400">({product.reviewsCount} Reviews)</span>
              <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
              <span className={product.stock > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          <div className="text-3xl font-black text-gray-900">
            {formatCurrency(product.price)}
          </div>

          <p className="text-gray-500 leading-relaxed text-lg">
            {product.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl flex items-center space-x-4">
              <Truck size={24} className="text-orange-600" />
              <div className="text-sm font-bold">Fast Delivery</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl flex items-center space-x-4">
              <Shield size={24} className="text-orange-600" />
              <div className="text-sm font-bold">Genuine Warranty</div>
            </div>
          </div>

          <div className="flex space-x-4 pt-8">
            <button 
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="flex-grow py-5 bg-orange-600 text-white font-black uppercase tracking-widest rounded-3xl hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 flex items-center justify-center space-x-3"
            >
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </button>
            <button className="p-5 border border-gray-200 rounded-3xl text-gray-400 hover:text-orange-600 hover:border-orange-200 transition-all">
              <Heart size={24} />
            </button>
            <button className="p-5 border border-gray-200 rounded-3xl text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all">
              <Share2 size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-4xl">
        <h2 className="text-2xl font-black mb-12">Customer Reviews</h2>
        
        {user && (
          <form onSubmit={handleAddReview} className="mb-16 bg-gray-50 p-8 rounded-[40px] border border-gray-100">
            <h3 className="font-bold mb-6">Write a Review</h3>
            <div className="flex space-x-2 mb-6">
              {[1,2,3,4,5].map((s) => (
                <button 
                  key={s} 
                  type="button"
                  onClick={() => setRating(s)}
                  className={`p-1 ${rating >= s ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  <Star size={24} fill={rating >= s ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
            <textarea 
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Tell us what you think about this product..."
              className="w-full p-6 rounded-3xl border-none focus:ring-2 focus:ring-orange-500 min-h-[120px] mb-6"
            />
            <button className="px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all">
              Post Review
            </button>
          </form>
        )}

        <div className="space-y-8">
          {reviews.map(review => (
            <div key={review.id} className="pb-8 border-b border-gray-100">
              <div className="flex justify-between mb-4">
                <div className="font-bold text-gray-900">{review.userName}</div>
                <div className="text-yellow-500 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed italic">"{review.comment}"</p>
              <div className="text-[10px] uppercase font-black text-gray-300 mt-4 tracking-widest">
                {new Date(review.createdAt?.seconds * 1000).toLocaleDateString()}
              </div>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-gray-400 italic">Be the first to review this product!</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
