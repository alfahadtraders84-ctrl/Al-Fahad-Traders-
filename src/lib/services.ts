import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  setDoc,
  updateDoc, 
  orderBy, 
  limit, 
  onSnapshot,
  Timestamp,
  increment,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Order, OrderStatus, Review, UserProfile, UserRole } from '../types';

// Products
export const getProducts = async (category?: string, minPrice?: number, maxPrice?: number) => {
  let q = query(collection(db, 'products'), orderBy('updatedAt', 'desc'));
  if (category && category !== 'All') {
    q = query(q, where('category', '==', category));
  }
  const snapshot = await getDocs(q);
  let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  
  if (minPrice !== undefined) products = products.filter(p => p.price >= minPrice);
  if (maxPrice !== undefined) products = products.filter(p => p.price <= maxPrice);
  
  return products;
};

export const getProduct = async (id: string) => {
  const docRef = doc(db, 'products', id);
  const snap = await getDoc(docRef);
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Product) : null;
};

// Orders
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
  const batch = writeBatch(db);
  
  // 1. Create Order
  const orderRef = doc(collection(db, 'orders'));
  const timestamp = Timestamp.now();
  batch.set(orderRef, {
    ...orderData,
    createdAt: timestamp,
    updatedAt: timestamp
  });
  
  // 2. Update Stock
  orderData.items.forEach(item => {
    const productRef = doc(db, 'products', item.productId);
    batch.update(productRef, {
      stock: increment(-item.quantity)
    });
  });
  
  // 3. Update User Balance if Reseller
  if (orderData.isResellerOrder && orderData.commissionAmount) {
    const userRef = doc(db, 'users', orderData.userId);
    batch.update(userRef, {
      commissionBalance: increment(orderData.commissionAmount)
    });
  }
  
  await batch.commit();
  return orderRef.id;
};

export const getOrders = async (userId?: string) => {
  let q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  if (userId) {
    q = query(q, where('userId', '==', userId));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { 
    status,
    updatedAt: Timestamp.now()
  });
};

// User Profile
export const getUserProfile = async (uid: string) => {
  const docRef = doc(db, 'users', uid);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as UserProfile) : null;
};

export const createUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  const docRef = doc(db, 'users', uid);
  await setDoc(docRef, {
    uid,
    displayName: data.displayName || '',
    email: data.email || '',
    role: data.role || UserRole.CUSTOMER,
    commissionBalance: 0,
    address: { street: '', city: '', zip: '' },
    createdAt: Timestamp.now(),
    ...data
  });
};

// Reviews
export const addReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'reviews'), {
    ...review,
    createdAt: Timestamp.now()
  });
  
  // Update product rating (simplified)
  const productRef = doc(db, 'products', review.productId);
  await updateDoc(productRef, {
    reviewsCount: increment(1)
  });
  
  return docRef.id;
};

export const getReviews = async (productId: string) => {
  const q = query(collection(db, 'reviews'), where('productId', '==', productId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
};
