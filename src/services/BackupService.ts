// ============================================
// SERVICE DE SAUVEGARDE
// ============================================

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { formatDate } from '../utils/dateUtils';
import DatabaseService from './DatabaseService';

export class BackupService {
  private static instance: BackupService;

  static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  async createBackup(): Promise<string> {
    try {
      const date = formatDate(new Date()).replace(/\//g, '-');
      const fileName = stockia_backup_.db;
      const backupPath = ${FileSystem.documentDirectory};

      await DatabaseService.backup(backupPath);

      console.log('✅ Sauvegarde créée:', backupPath);
      return backupPath;
    } catch (error) {
      console.error('❌ Erreur création sauvegarde:', error);
      throw error;
    }
  }

  async shareBackup(): Promise<void> {
    try {
      const backupPath = await this.createBackup();
      await Sharing.shareAsync(backupPath, {
        mimeType: 'application/x-sqlite3',
        dialogTitle: 'Partager la sauvegarde',
      });
    } catch (error) {
      console.error('❌ Erreur partage sauvegarde:', error);
      throw error;
    }
  }

  async getBackups(): Promise<{ name: string; size: number; date: Date }[]> {
    try {
      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
      const backups = files
        .filter(f => f.startsWith('stockia_backup_') && f.endsWith('.db'))
        .map(async (f) => {
          const info = await FileSystem.getInfoAsync(
            ${FileSystem.documentDirectory}
          );
          return {
            name: f,
            size: info.exists ? info.size || 0 : 0,
            date: new Date(info.exists ? info.modificationTime || Date.now() : Date.now()),
          };
        });
      
      return await Promise.all(backups);
    } catch (error) {
      console.error('❌ Erreur liste sauvegardes:', error);
      return [];
    }
  }
}

export default BackupService.getInstance();

