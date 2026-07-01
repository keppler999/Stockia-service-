// ============================================
// TYPES GLOBAUX DE L'APPLICATION
// ============================================

export interface Product {
  id: string;
  name: string;
  barcode?: string;
  price: number;
  cost?: number;
  stock: number;
  minStock: number;
  category: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  saleDate: Date;
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  paymentMethod: 'cash' | 'card' | 'mobile' | 'credit';
  clientId?: string;
  userId: string;
  items: SaleItem[];
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: Date;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  profit?: number;
}

export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  loyaltyPoints: number;
  totalPurchases: number;
  lastPurchaseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
  isBiometric: boolean;
  pinCode?: string;
  lastLogin?: Date;
  createdAt: Date;
}

export interface Licence {
  id: string;
  deviceId: string;
  clientEmail?: string;
  activatedAt: Date;
  expiresAt: Date;
  isActive: boolean;
  trialUsed: boolean;
  activationCode?: string;
  lastVerification: Date;
}

export interface Settings {
  id: string;
  companyName: string;
  taxRate: number;
  currency: string;
  receiptHeader?: string;
  receiptFooter?: string;
  lowStockAlert: number;
  autoBackup: boolean;
  language: 'fr' | 'en';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DashboardStats {
  revenue: {
    today: number;
    week: number;
    month: number;
    year: number;
  };
  sales: {
    today: number;
    week: number;
    month: number;
    year: number;
  };
  stock: {
    total: number;
    low: number;
    outOfStock: number;
  };
  clients: {
    total: number;
    new: number;
    active: number;
  };
}
