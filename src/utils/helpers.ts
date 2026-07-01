// ============================================
// FONCTIONS UTILITAIRES
// ============================================

import * as Crypto from 'expo-crypto';

/**
 * Génère un ID unique
 */
export const generateId = async (): Promise<string> => {
  return await Crypto.randomUUID();
};

/**
 * Calcule la TVA
 */
export const calculateTax = (amount: number, rate: number): number => {
  return amount * (rate / 100);
};

/**
 * Arrondi à 2 décimales
 */
export const round2 = (num: number): number => {
  return Math.round(num * 100) / 100;
};

/**
 * Vérifie si une chaîne est vide
 */
export const isEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Tronque une chaîne
 */
export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

/**
 * Débounce une fonction
 */
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

/**
 * Retarde l'exécution
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Copie un objet
 */
export const deepCopy = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Calcule le nombre de jours entre deux dates
 */
export const daysBetween = (start: Date, end: Date): number => {
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * Génère un nombre aléatoire
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Vérifie si l'appareil est en ligne
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Obtient la plateforme
 */
export const getPlatform = (): string => {
  return Platform.OS;
};

/**
 * Obtient la version de l'appareil
 */
export const getDeviceInfo = (): string => {
  return ${Platform.OS} ;
};
