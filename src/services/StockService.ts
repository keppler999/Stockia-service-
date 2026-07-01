// ============================================
// SERVICE DE GESTION DE STOCK
// ============================================

import * as Crypto from 'expo-crypto';
import DatabaseService from './DatabaseService';
import type { Product } from '../types';

export class StockService {
  private static instance: StockService;

  static getInstance(): StockService {
    if (!StockService.instance) {
      StockService.instance = new StockService();
    }
    return StockService.instance;
  }

  async getAllProducts(): Promise<Product[]> {
    const results = await DatabaseService.query(
      'SELECT * FROM products ORDER BY name'
    );
    return results.map(this.mapProduct);
  }

  async getProductById(id: string): Promise<Product | null> {
    const result = await DatabaseService.queryOne(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    return result ? this.mapProduct(result) : null;
  }

  async getProductByBarcode(barcode: string): Promise<Product | null> {
    const result = await DatabaseService.queryOne(
      'SELECT * FROM products WHERE barcode = ?',
      [barcode]
    );
    return result ? this.mapProduct(result) : null;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const results = await DatabaseService.query(
      'SELECT * FROM products WHERE category = ? ORDER BY name',
      [category]
    );
    return results.map(this.mapProduct);
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const id = await Crypto.randomUUID();
    const now = new Date().toISOString();

    await DatabaseService.execute(
      INSERT INTO products (
        id, name, barcode, price, cost, stock, min_stock, category, description, image, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
      [
        id,
        product.name,
        product.barcode || null,
        product.price,
        product.cost || null,
        product.stock || 0,
        product.minStock || 5,
        product.category || ',
        product.description || null,
        product.image || null,
        now,
        now,
      ]
    );

    return { ...product, id, createdAt: new Date(), updatedAt: new Date() };
  }

  async createProducts(products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Product[]> {
    const created: Product[] = [];
    for (const product of products) {
      const p = await this.createProduct(product);
      created.push(p);
    }
    return created;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
    if (updates.barcode !== undefined) { fields.push('barcode = ?'); values.push(updates.barcode); }
    if (updates.price !== undefined) { fields.push('price = ?'); values.push(updates.price); }
    if (updates.cost !== undefined) { fields.push('cost = ?'); values.push(updates.cost); }
    if (updates.stock !== undefined) { fields.push('stock = ?'); values.push(updates.stock); }
    if (updates.minStock !== undefined) { fields.push('min_stock = ?'); values.push(updates.minStock); }
    if (updates.category !== undefined) { fields.push('category = ?'); values.push(updates.category); }
    if (updates.description !== undefined) { fields.push('description = ?'); values.push(updates.description); }
    if (updates.image !== undefined) { fields.push('image = ?'); values.push(updates.image); }

    if (fields.length === 0) return null;

    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    await DatabaseService.execute(
      UPDATE products SET  WHERE id = ?,
      values
    );

    return await this.getProductById(id);
  }

  async deleteProduct(id: string): Promise<boolean> {
    await DatabaseService.execute('DELETE FROM products WHERE id = ?', [id]);
    return true;
  }

  async updateStock(id: string, quantity: number): Promise<Product | null> {
    const product = await this.getProductById(id);
    if (!product) return null;

    const newStock = product.stock + quantity;
    if (newStock < 0) return null;

    return await this.updateProduct(id, { stock: newStock });
  }

  async getLowStockProducts(): Promise<Product[]> {
    const results = await DatabaseService.query(
      'SELECT * FROM products WHERE stock <= min_stock ORDER BY stock'
    );
    return results.map(this.mapProduct);
  }

  async getOutOfStockProducts(): Promise<Product[]> {
    const results = await DatabaseService.query(
      'SELECT * FROM products WHERE stock <= 0 ORDER BY name'
    );
    return results.map(this.mapProduct);
  }

  async getTotalStockValue(): Promise<number> {
    const result = await DatabaseService.queryOne(
      'SELECT SUM(stock * price) as value FROM products'
    );
    return result?.value || 0;
  }

  async getStockCount(): Promise<number> {
    const result = await DatabaseService.queryOne(
      'SELECT COUNT(*) as count FROM products'
    );
    return result?.count || 0;
  }

  async getProductsBySearch(query: string): Promise<Product[]> {
    const results = await DatabaseService.query(
      'SELECT * FROM products WHERE name LIKE ? OR barcode LIKE ? ORDER BY name',
      [%%, %%]
    );
    return results.map(this.mapProduct);
  }

  async getCategories(): Promise<string[]> {
    const results = await DatabaseService.query(
      'SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != " ORDER BY category'
    );
    return results.map((r: any) => r.category);
  }

  private mapProduct(data: any): Product {
    return {
      id: data.id,
      name: data.name,
      barcode: data.barcode || undefined,
      price: data.price,
      cost: data.cost || undefined,
      stock: data.stock,
      minStock: data.min_stock,
      category: data.category || ',
      description: data.description || undefined,
      image: data.image || undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}

export default StockService.getInstance();

