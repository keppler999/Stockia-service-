// ============================================
// FONCTIONS UTILITAIRES
// ============================================

import * as Crypto from 'expo-crypto';

export const generateId = async (): Promise<string> => {
  return await Crypto.randomUUID();
};

export const formatCurrency = (amount: number, currency = 'FC'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'CDF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('CDF', currency);
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR');
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const daysBetween = (start: Date, end: Date): number => {
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const calculateTax = (amount: number, rate: number): number => {
  return amount * (rate / 100);
};

export const round2 = (num: number): number => {
  return Math.round(num * 100) / 100;
};

export const isEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
