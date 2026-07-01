// ============================================
// CONSTANTES UTILITAIRES
// ============================================

export const APP = {
  NAME: 'Stockia',
  VERSION: '3.0.0',
  COMPANY: 'Spirale Agence',
  SUPPORT_EMAIL: 'info.elysafly@gmail.com',
  WHATSAPP: '+24383009563',
} as const;

export const LICENCE = {
  PRICE: 15000,
  CURRENCY: 'FC',
  TRIAL_DAYS: 7,
  PERIOD_DAYS: 30,
} as const;

export const STORAGE_KEYS = {
  USER: '@stockia_user',
  LICENCE: '@stockia_licence',
  SETTINGS: '@stockia_settings',
  CART: '@stockia_cart',
  DEVICE_ID: '@stockia_device_id',
  THEME: '@stockia_theme',
} as const;

export const PAYMENT_METHODS = [
  { label: 'Espèces', value: 'cash' },
  { label: 'Carte bancaire', value: 'card' },
  { label: 'Mobile Money', value: 'mobile' },
  { label: 'Crédit', value: 'credit' },
] as const;

export const PRODUCT_CATEGORIES = [
  'Alimentation',
  'Boissons',
  'Électronique',
  'Vêtements',
  'Pharmacie',
  'Cosmétique',
  'Maison',
  'Autre',
] as const;

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CASHIER: 'cashier',
} as const;

export const ROLE_LABELS = {
  admin: 'Administrateur',
  manager: 'Gestionnaire',
  cashier: 'Caissier',
} as const;

export const LANGUAGES = {
  fr: 'Français',
  en: 'English',
} as const;

export const ERROR_CODES = {
  NETWORK: 'ERR_NETWORK',
  AUTH: 'ERR_AUTH',
  LICENCE_EXPIRED: 'ERR_LICENCE_EXPIRED',
  DATABASE: 'ERR_DATABASE',
  VALIDATION: 'ERR_VALIDATION',
  NOT_FOUND: 'ERR_NOT_FOUND',
} as const;
