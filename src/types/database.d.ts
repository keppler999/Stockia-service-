// ============================================
// TYPES DE LA BASE DE DONNÉES
// ============================================

export interface DBProduct {
  id: string;
  name: string;
  barcode: string | null;
  price: number;
  cost: number | null;
  stock: number;
  min_stock: number;
  category: string | null;
  description: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBSale {
  id: string;
  sale_date: string;
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  payment_method: 'cash' | 'card' | 'mobile' | 'credit';
  client_id: string | null;
  user_id: string;
  status: 'completed' | 'pending' | 'cancelled';
  created_at: string;
}

export interface DBSaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
  profit: number | null;
}

export interface DBClient {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  loyalty_points: number;
  total_purchases: number;
  last_purchase_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBUser {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'manager' | 'cashier';
  is_biometric: number;
  pin_code: string | null;
  last_login: string | null;
  created_at: string;
}

export interface DBLicence {
  id: string;
  device_id: string;
  client_email: string | null;
  activated_at: string;
  expires_at: string;
  is_active: number;
  trial_used: number;
  activation_code: string | null;
  last_verification: string;
}
