export type ProductCategory =
  | 'Mates'
  | 'Bombillas'
  | 'Termos'
  | 'Canastas y Materas'
  | 'Yerberas'
  | 'Combos'
  | 'Yerbas';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  tag?: string;
  image: string;
  description: string;
  features: string[];
  specs: {
    material: string;
    virola?: string;
    capacidad?: string;
    origen: string;
  };
  inStock: boolean;
  stockCount: number;
  featured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface StoreConfig {
  brandName: string;
  tagline: string;
  location: string;
  announcement: string;
  whatsappNumber: string;
  contactEmail: string;
  instagramHandle: string;
  currency: string;
  freeShippingThreshold: number;
  transferDiscountPercent: number;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroImage: string;
  logoImage: string;
  logoBadgeImage: string;
  aliasCbu: string;
  bankName: string;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  productName: string;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'transfer' | 'card' | 'cash';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: ProductCategory;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "TNZ-1024"
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  customerCity?: string;
  customerNotes?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  trackingNumber?: string;
  shippingCarrier?: string; // "Correo Argentino" | "Andreani" | "Retiro en Taller Carlos Paz"
}
