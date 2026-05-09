export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  RESELLER = 'reseller'
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  points: number;
  commissionBalance: number;
  addresses: Address[];
  wishlist: string[]; // product IDs
  createdAt: any;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  lowStockThreshold: number;
  rating: number;
  reviewsCount: number;
  updatedAt: any;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: 'cod' | 'card';
  customerName: string;
  customerEmail: string;
  isResellerOrder: boolean;
  commissionAmount?: number;
  createdAt: any;
  updatedAt: any;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}
