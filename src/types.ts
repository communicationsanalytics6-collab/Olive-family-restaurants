export type UserRole = 'super_admin' | 'spur_editor' | 'panarottis_editor' | 'customer';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  savedAddresses: string[];
  favourites: string[]; // array of menu item IDs
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in Nigerian Naira (₦)
  category: string;
  imageUrl: string;
  brand: 'spur' | 'panarottis';
  isPopular: boolean;
  prepTime: number; // in minutes
}

export interface Store {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  openingHours: string;
  brand: 'spur' | 'panarottis' | 'both';
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'dispatched' | 'delivered';
  brand: 'spur' | 'panarottis';
  createdAt: string;
  deliveryMinutes: number;
  courierName: string;
  trackingCoordinates: {
    lat: number;
    lng: number;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string;
  brand: 'spur' | 'panarottis' | 'general';
  author: string;
  date: string;
  readingTime: string;
  isFeatured: boolean;
  isPublished: boolean;
  scheduledDate?: string;
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  code: string;
  discountPercent: number;
  imageUrl: string;
  brand: 'spur' | 'panarottis' | 'both';
  isBannerActive: boolean;
  expiresAt: string;
}

export interface Feedback {
  id: string;
  name: string;
  email: string;
  brand: 'spur' | 'panarottis' | 'general';
  type: 'complaint' | 'suggestion' | 'praise';
  subject: string;
  message: string;
  rating: number;
  status: 'open' | 'resolved';
  createdAt: string;
}

export interface TableReservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  guestsCount: number;
  date: string;
  time: string;
  brand: 'spur' | 'panarottis';
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface VisitorAgreement {
  id: string;
  visitorName: string;
  visitorEmail: string;
  visitorCompany: string;
  userAgent: string;
  agreed: boolean;
  agreedAt: string;
  legalVersion: string;
}
