// ============================================
// LICENCE SECURITY
// ============================================

import * as Crypto from 'expo-crypto';

const SECRET_KEY = 'STOCKIA_SECURE_2024';

export const generateLicenceCode = async (deviceId: string): Promise<string> => {
  const timestamp = Date.now();
  const raw = ${deviceId}--;
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    raw
  );
  return STOCKIA-;
};

export const validateLicenceCode = async (code: string, deviceId: string): Promise<boolean> => {
  if (!code.startsWith('STOCKIA-')) return false;
  if (code.length < 14) return false;
  
  // Vérification plus poussée
  const expected = await generateLicenceCode(deviceId);
  return code === expected;
};

export const isLicenceExpired = (expiryDate: Date): boolean => {
  const now = new Date();
  return now > expiryDate;
};

export const getRemainingDays = (expiryDate: Date): number => {
  const now = new Date();
  const diff = expiryDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};
