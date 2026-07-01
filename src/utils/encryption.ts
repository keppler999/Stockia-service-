// ============================================
// CHIFFREMENT ET SÉCURITÉ
// ============================================

import * as Crypto from 'expo-crypto';

const SALT = 'STOCKIA_SALT_2024';

export const hashPassword = async (password: string): Promise<string> => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + SALT
  );
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const hashed = await hashPassword(password);
  return hashed === hash;
};

export const encrypt = (text: string): string => {
  try {
    return btoa(text);
  } catch {
    return text;
  }
};

export const decrypt = (encrypted: string): string => {
  try {
    return atob(encrypted);
  } catch {
    return encrypted;
  }
};

export const generateToken = async (): Promise<string> => {
  const random = await Crypto.randomUUID();
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    ${random}--
  );
};

export const generateActivationCode = async (deviceId: string): Promise<string> => {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    ${deviceId}--
  );
  return 'STOCKIA-' + hash.substring(0, 12);
};
