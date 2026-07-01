// ============================================
// VALIDATEURS
// ============================================

import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Nom requis').max(100),
  barcode: z.string().max(13).optional(),
  price: z.number().min(0, 'Prix invalide'),
  cost: z.number().min(0).optional(),
  stock: z.number().int().min(0, 'Stock invalide'),
  minStock: z.number().int().min(0),
  category: z.string().min(1, 'Catégorie requise'),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const SaleSchema = z.object({
  id: z.string().optional(),
  saleDate: z.date().optional(),
  total: z.number().min(0),
  subtotal: z.number().min(0),
  tax: z.number().min(0),
  discount: z.number().min(0),
  paymentMethod: z.enum(['cash', 'card', 'mobile', 'credit']),
  clientId: z.string().optional(),
  userId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.number().int().min(1),
    unitPrice: z.number().min(0),
    total: z.number().min(0),
  })),
  status: z.enum(['completed', 'pending', 'cancelled']).default('completed'),
});

export const ClientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Nom requis').max(50),
  phone: z.string().optional(),
  email: z.string().email('Email invalide').optional(),
  address: z.string().optional(),
  loyaltyPoints: z.number().int().min(0).default(0),
  totalPurchases: z.number().min(0).default(0),
});

export const UserSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(3, 'Username trop court').max(20),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
  role: z.enum(['admin', 'manager', 'cashier']).default('cashier'),
  isBiometric: z.boolean().default(false),
  pinCode: z.string().optional(),
});

export const validateProduct = (data: unknown) => ProductSchema.parse(data);
export const validateSale = (data: unknown) => SaleSchema.parse(data);
export const validateClient = (data: unknown) => ClientSchema.parse(data);
export const validateUser = (data: unknown) => UserSchema.parse(data);
