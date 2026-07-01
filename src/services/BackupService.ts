// ============================================
// SERVICE DE SAUVEGARDE
// ============================================

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
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
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const fileName = stockia_backup_.db;
      const backupPath = FileSystem.documentDirectory + fileName;

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
      
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Le partage n\'est pas disponible sur cet appareil');
      }

      await Sharing.shareAsync(backupPath, {
        mimeType: 'application/x-sqlite3',
        dialogTitle: 'Partager la sauvegarde',
      });
    } catch (error) {
      console.error('❌ Erreur partage sauvegarde:', error);
      throw error;
    }
  }

  async getBackups(): Promise<Array<{
    name: string;
    size: number;
    date: Date;
  }>> {
    try {
      const files = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );
      
      const backupFiles = files.filter(
        (file) => file.startsWith('stockia_backup_') && file.endsWith('.db')
      );

      const results = [];
      for (const file of backupFiles) {
        const info = await FileSystem.getInfoAsync(
          FileSystem.documentDirectory + file
        );
        if (info.exists) {
          results.push({
            name: file,
            size: info.size || 0,
            date: new Date(info.modificationTime || Date.now())
          });
        }
      }

      return results.sort((a, b) => b.date.getTime() - a.date.getTime());
    } catch (error) {
      console.error('❌ Erreur liste sauvegardes:', error);
      return [];
    }
  }

  async deleteBackup(fileName: string): Promise<boolean> {
    try {
      const filePath = FileSystem.documentDirectory + fileName;
      await FileSystem.deleteAsync(filePath);
      return true;
    } catch (error) {
      console.error('❌ Erreur suppression sauvegarde:', error);
      return false;
    }
  }

  async getBackupSize(fileName: string): Promise<number> {
    try {
      const filePath = FileSystem.documentDirectory + fileName;
      const info = await FileSystem.getInfoAsync(filePath);
      return info.exists ? info.size || 0 : 0;
    } catch {
      return 0;
    }
  }
}

export default BackupService.getInstance();
