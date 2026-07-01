// ============================================
// PERMISSIONS
// ============================================

import { Platform } from 'react-native';
import * as Camera from 'expo-camera';

export const checkCameraPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
};

export const checkStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      // Pour Android 13+, utiliser les permissions média
      return true;
    } catch {
      return false;
    }
  }
  return true;
};

export const requestPermissions = async (): Promise<{
  camera: boolean;
  storage: boolean;
}> => {
  const camera = await checkCameraPermission();
  const storage = await checkStoragePermission();
  return { camera, storage };
};
