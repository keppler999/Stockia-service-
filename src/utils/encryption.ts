// ============================================
// CHIFFREMENT ET SÉCURITÉ
// ============================================

import * as Crypto from 'expo-crypto';

const SALT = 'STOCKIA_SALT_2024';

/**
 * Hash un mot de passe
 */
export const hashPassword = async (password: string): Promise<string> => {
  const data = password + SALT;
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data
  );
};

/**
 * Vérifie un mot de passe
 */
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  const hashed = await hashPassword(password);
  return hashed === hash;
};

/**
 * Chiffre une chaîne (simple obfuscation)
 */
export const encrypt = (text: string): string => {
  try {
    return btoa(text);
  } catch {
    return text;
  }
};

/**
 * Déchiffre une chaîne
 */
export const decrypt = (encrypted: string): string => {
  try {
    return atob(encrypted);
  } catch {
    return encrypted;
  }
};

/**
 * Génère un token de session
 */
export const generateToken = async (): Promise<string> => {
  const random = await Crypto.randomUUID();
  const timestamp = Date.now();
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    ${random}--
  );
};

/**
 * Génère un code d'activation unique
 */
export const generateActivationCode = async (deviceId: string): Promise<string> => {
  const timestamp = Date.now();
  const raw = ${deviceId}--;
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    raw
  );
  return 'STOCKIA-' + hash.substring(0, 12);
};
