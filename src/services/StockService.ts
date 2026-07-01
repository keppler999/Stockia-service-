// ============================================
// SERVICE DE GESTION DE STOCK (VERSION SIMPLIFIÉE)
// ============================================

import * as Crypto from 'expo-crypto';
import DatabaseService from './DatabaseService';

export class StockService {
  private static instance: StockService;

  static getInstance(): StockService {
    if (!StockService.instance) {
      StockService.instance = new StockService();
    }
    return StockService.instance;
  }

  async getAllProducts(): Promise<any[]> {
    return await DatabaseService.query('SELECT * FROM products ORDER BY name');
  }

  async getProductById(id: string): Promise<any | null> {
    return await DatabaseService.queryOne('SELECT * FROM products WHERE id = ?', [id]);
  }

  async getProductByBarcode(barcode: string): Promise<any | null> {
    return await DatabaseService.queryOne('SELECT * FROM products WHERE barcode = ?', [barcode]);
  }

  async createProduct(data: any): Promise<any> {
    const id = await Crypto.randomUUID();
    const now = new Date().toISOString();

    await DatabaseService.execute(
      INSERT INTO products (id, name, barcode, price, cost, stock, min_stock, category, description, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
      [id, data.name, data.barcode || null, data.price, data.cost || null, data.stock || 0, data.minStock || 5, data.category || '', data.description || null, now, now]
    );

    return { ...data, id, createdAt: now, updatedAt: now };
  }

  async updateProduct(id: string, data: any): Promise<any> {
    await DatabaseService.execute(
      UPDATE products SET name = ?, barcode = ?, price = ?, cost = ?, stock = ?, min_stock = ?, category = ?, description = ?, updated_at = ?
       WHERE id = ?,
      [data.name, data.barcode || null, data.price, data.cost || null, data.stock, data.minStock, data.category || '', data.description || null, new Date().toISOString(), id]
    );
    return this.getProductById(id);
  }

  async deleteProduct(id: string): Promise<void> {
    await DatabaseService.execute('DELETE FROM products WHERE id = ?', [id]);
  }

  async updateStock(id: string, quantity: number): Promise<any> {
    const product = await this.getProductById(id);
    if (!product) return null;
    const newStock = product.stock + quantity;
    if (newStock < 0) return null;
    return this.updateProduct(id, { ...product, stock: newStock });
  }

  async getLowStockProducts(): Promise<any[]> {
    return await DatabaseService.query('SELECT * FROM products WHERE stock <= min_stock ORDER BY stock');
  }

  async getOutOfStockProducts(): Promise<any[]> {
    return await DatabaseService.query('SELECT * FROM products WHERE stock <= 0 ORDER BY name');
  }

  async getTotalStockValue(): Promise<number> {
    const result = await DatabaseService.queryOne('SELECT SUM(stock * price) as value FROM products');
    return result?.value || 0;
  }

  async getStockCount(): Promise<number> {
    const result = await DatabaseService.queryOne('SELECT COUNT(*) as count FROM products');
    return result?.count || 0;
  }

  async searchProducts(query: string): Promise<any[]> {
    return await DatabaseService.query(
      'SELECT * FROM products WHERE name LIKE ? OR barcode LIKE ? ORDER BY name',
      [%%, %%]
    );
  }
}

export default StockService.getInstance();
