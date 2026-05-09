import { useState, useEffect } from 'react';
import { collection, query, limit, getDocs, orderBy, writeBatch, doc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '../types';

const SAMPLE_PRODUCTS = [
  {
    name: "Classic Leather Watch",
    description: "Elegant mechanical watch with premium leather strap.",
    price: 15000,
    category: "Watches",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    stock: 25,
    lowStockThreshold: 5,
    rating: 4.8,
    reviewsCount: 124
  },
  {
    name: "Noise Cancelling Headphones",
    description: "Premium wireless headphones with active noise cancellation.",
    price: 25000,
    category: "Audio",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    stock: 12,
    lowStockThreshold: 3,
    rating: 4.5,
    reviewsCount: 89
  },
  {
    name: "Minimalist Desk Lamp",
    description: "Sleek LED desk lamp with adjustable brightness.",
    price: 4500,
    category: "Home Office",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
    stock: 45,
    lowStockThreshold: 10,
    rating: 4.2,
    reviewsCount: 56
  },
  {
    name: "Leather Messenger Bag",
    description: "Genuine leather bag for professional use.",
    price: 12500,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    stock: 8,
    lowStockThreshold: 2,
    rating: 4.9,
    reviewsCount: 230
  }
];

export const useStoreData = () => {
  const [isInitializing, setIsInitializing] = useState(false);

  const initData = async () => {
    setIsInitializing(true);
    try {
      const q = query(collection(db, 'products'), limit(1));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        console.log("Initializing database with sample products...");
        const batch = writeBatch(db);
        const timestamp = Timestamp.now();
        
        SAMPLE_PRODUCTS.forEach(p => {
          const ref = doc(collection(db, 'products'));
          batch.set(ref, {
            ...p,
            updatedAt: timestamp
          });
        });
        
        await batch.commit();
      }
    } catch (e) {
      console.error("Error initializing data:", e);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  return { isInitializing };
};
