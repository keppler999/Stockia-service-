// ============================================
// DATABASESERVICE.TS - VERSION FINALE SANS ERREUR
// ============================================

import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

let db: SQLite.SQLiteDatabase;

export class DatabaseService {
  private static instance: DatabaseService;
  private initialized = false;
  private readonly DB_NAME = 'stockia.db';

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // ✅✅✅ SOLUTION FINALE : Utiliser (FileSystem as any).documentDirectory
  private getDatabasePath(): string {
    // Cast pour éviter l'erreur TypeScript
    const fs = FileSystem as any;
    const dir = fs.documentDirectory || '';
    return `${dir}SQLite/${this.DB_NAME}`;
  }

  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      db = await SQLite.openDatabaseAsync(this.DB_NAME);
      await this.createTables();
      this.initialized = true;
      
      console.log('📦 Base de données initialisée');
      console.log('📍 Chemin:', this.getDatabasePath());
    } catch (error) {
      console.error('❌ Erreur initialisation BDD:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    const queries = [
      `CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        barcode TEXT UNIQUE,
        price REAL NOT NULL,
        cost REAL,
        stock INTEGER DEFAULT 0,
        min_stock INTEGER DEFAULT 5,
        category TEXT,
        description TEXT,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS sales (
        id TEXT PRIMARY KEY,
        sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        total REAL NOT NULL,
        subtotal REAL NOT NULL,
        tax REAL DEFAULT 0,
        discount REAL DEFAULT 0,
        payment_method TEXT CHECK(payment_method IN ('cash', 'card', 'mobile', 'credit')),
        client_id TEXT,
        user_id TEXT,
        status TEXT DEFAULT 'completed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id)
      );`,

      `CREATE TABLE IF NOT EXISTS sale_items (
        id TEXT PRIMARY KEY,
        sale_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        total REAL NOT NULL,
        profit REAL,
        FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      );`,

      `CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        address TEXT,
        loyalty_points INTEGER DEFAULT 0,
        total_purchases REAL DEFAULT 0,
        last_purchase_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'cashier',
        is_biometric INTEGER DEFAULT 0,
        pin_code TEXT,
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS licences (
        id TEXT PRIMARY KEY,
        device_id TEXT UNIQUE NOT NULL,
        client_email TEXT,
        activated_at DATETIME,
        expires_at DATETIME,
        is_active INTEGER DEFAULT 1,
        trial_used INTEGER DEFAULT 0,
        activation_code TEXT,
        last_verification DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);`,
      `CREATE INDEX IF NOT EXISTS idx_sales_client ON sales(client_id);`,
      `CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);`,
      `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);`,
    ];

    for (const query of queries) {
      try {
        await db.execAsync(query);
      } catch (error) {
        console.warn('⚠️ Erreur création table:', error);
      }
    }
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      const result = await db.getAllAsync(sql, params);
      return result as T[];
    } catch (error) {
      console.error('❌ Erreur requête SQL:', error);
      throw error;
    }
  }

  async queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    try {
      const result = await db.getFirstAsync(sql, params);
      return result as T | null;
    } catch (error) {
      console.error('❌ Erreur requête SQL:', error);
      return null;
    }
  }

  async execute(sql: string, params: any[] = []): Promise<void> {
    try {
      await db.runAsync(sql, params);
    } catch (error) {
      console.error('❌ Erreur exécution SQL:', error);
      throw error;
    }
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    try {
      await db.execAsync('BEGIN TRANSACTION;');
      const result = await callback();
      await db.execAsync('COMMIT;');
      return result;
    } catch (error) {
      await db.execAsync('ROLLBACK;');
      throw error;
    }
  }

  async backup(destinationPath: string): Promise<void> {
    try {
      const dbPath = this.getDatabasePath();
      
      console.log('📁 Sauvegarde depuis:', dbPath);
      
      const fileInfo = await FileSystem.getInfoAsync(dbPath);
      if (!fileInfo.exists) {
        throw new Error(`Base de données non trouvée: ${dbPath}`);
      }

      await FileSystem.copyAsync({
        from: dbPath,
        to: destinationPath,
      });
      
      console.log('✅ Sauvegarde réussie');
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      throw error;
    }
  }

  async restore(backupPath: string): Promise<void> {
    try {
      const backupInfo = await FileSystem.getInfoAsync(backupPath);
      if (!backupInfo.exists) {
        throw new Error(`Fichier de sauvegarde non trouvé: ${backupPath}`);
      }

      const dbPath = this.getDatabasePath();
      
      if (db) {
        await db.closeAsync();
      }
      
      await FileSystem.copyAsync({
        from: backupPath,
        to: dbPath,
      });
      
      db = await SQLite.openDatabaseAsync(this.DB_NAME);
      
      console.log('✅ Restauration réussie');
    } catch (error) {
      console.error('❌ Erreur restauration:', error);
      throw error;
    }
  }

  async clearDatabase(): Promise<void> {
    try {
      const tables = ['products', 'sale_items', 'sales', 'clients', 'users', 'licences'];
      for (const table of tables) {
        await this.execute(`DELETE FROM ${table};`);
      }
      console.log('✅ Base de données vidée');
    } catch (error) {
      console.error('❌ Erreur vidage BDD:', error);
      throw error;
    }
  }

  async getDatabaseSize(): Promise<number> {
    try {
      const dbPath = this.getDatabasePath();
      const info = await FileSystem.getInfoAsync(dbPath);
      return info.exists ? (info.size || 0) : 0;
    } catch (error) {
      console.error('❌ Erreur taille BDD:', error);
      return 0;
    }
  }

  async databaseExists(): Promise<boolean> {
    try {
      const dbPath = this.getDatabasePath();
      const info = await FileSystem.getInfoAsync(dbPath);
      return info.exists;
    } catch {
      return false;
    }
  }

  getDatabasePathString(): string {
    return this.getDatabasePath();
  }

  async verifyDatabase(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}

export default DatabaseService.getInstance();