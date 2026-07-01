// ============================================
// SERVICE DE GESTION DES VENTES
// ============================================

import * as Crypto from 'expo-crypto';
import DatabaseService from './DatabaseService';
import StockService from './StockService';
import type { Sale, SaleItem } from '../types';

export class SalesService {
  private static instance: SalesService;

  static getInstance(): SalesService {
    if (!SalesService.instance) {
      SalesService.instance = new SalesService();
    }
    return SalesService.instance;
  }

  async createSale(
    items: Omit<SaleItem, 'id' | 'saleId' | 'profit'>[],
    paymentMethod: 'cash' | 'card' | 'mobile' | 'credit',
    clientId?: string,
    userId?: string,
    discount: number = 0
  ): Promise<Sale> {
    const saleId = await Crypto.randomUUID();
    const now = new Date();

    let subtotal = 0;
    const saleItems: SaleItem[] = [];

    // Vérification du stock
    for (const item of items) {
      const product = await StockService.getProductById(item.productId);
      if (!product) throw new Error(Produit  introuvable);
      if (product.stock < item.quantity) {
        throw new Error(Stock insuffisant pour );
      }
    }

    // Créer les items et calculer le total
    for (const item of items) {
      const product = await StockService.getProductById(item.productId);
      if (!product) continue;

      const total = item.quantity * item.unitPrice;
      subtotal += total;
      const profit = product.cost ? (item.unitPrice - product.cost) * item.quantity : undefined;

      saleItems.push({
        id: await Crypto.randomUUID(),
        saleId,
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total,
        profit,
      });
    }

    const tax = subtotal * 0.16; // TVA 16%
    const total = subtotal + tax - discount;

    // Transaction
    await DatabaseService.transaction(async () => {
      // Insérer la vente
      await DatabaseService.execute(
        INSERT INTO sales (
          id, sale_date, total, subtotal, tax, discount, payment_method, client_id, user_id, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
        [
          saleId,
          now.toISOString(),
          total,
          subtotal,
          tax,
          discount,
          paymentMethod,
          clientId || null,
          userId || null,
          'completed',
          now.toISOString(),
        ]
      );

      // Insérer les items
      for (const item of saleItems) {
        await DatabaseService.execute(
          INSERT INTO sale_items (
            id, sale_id, product_id, product_name, quantity, unit_price, total, profit
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?),
          [
            item.id,
            item.saleId,
            item.productId,
            item.productName,
            item.quantity,
            item.unitPrice,
            item.total,
            item.profit || null,
          ]
        );

        // Mettre à jour le stock
        await StockService.updateStock(item.productId, -item.quantity);
      }

      // Mettre à jour le client
      if (clientId) {
        const client = await DatabaseService.queryOne(
          'SELECT * FROM clients WHERE id = ?',
          [clientId]
        );
        if (client) {
          await DatabaseService.execute(
            UPDATE clients SET 
              total_purchases = total_purchases + ?,
              last_purchase_date = ?,
              loyalty_points = loyalty_points + ?
            WHERE id = ?,
            [total, now.toISOString(), Math.floor(total / 1000), clientId]
          );
        }
      }
    });

    return {
      id: saleId,
      saleDate: now,
      total,
      subtotal,
      tax,
      discount,
      paymentMethod,
      clientId,
      userId: userId || '',
      items: saleItems,
      status: 'completed',
      createdAt: now,
    };
  }

  async getSales(dateFrom?: Date, dateTo?: Date): Promise<Sale[]> {
    let query = 'SELECT * FROM sales ORDER BY sale_date DESC';
    const params: any[] = [];

    if (dateFrom && dateTo) {
      query = 'SELECT * FROM sales WHERE sale_date BETWEEN ? AND ? ORDER BY sale_date DESC';
      params.push(dateFrom.toISOString(), dateTo.toISOString());
    }

    const results = await DatabaseService.query(query, params);
    const sales: Sale[] = [];

    for (const row of results) {
      const items = await DatabaseService.query(
        'SELECT * FROM sale_items WHERE sale_id = ?',
        [row.id]
      );

      sales.push({
        id: row.id,
        saleDate: new Date(row.sale_date),
        total: row.total,
        subtotal: row.subtotal,
        tax: row.tax,
        discount: row.discount,
        paymentMethod: row.payment_method,
        clientId: row.client_id || undefined,
        userId: row.user_id,
        items: items.map((item: any) => ({
          id: item.id,
          saleId: item.sale_id,
          productId: item.product_id,
          productName: item.product_name,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          total: item.total,
          profit: item.profit || undefined,
        })),
        status: row.status,
        createdAt: new Date(row.created_at),
      });
    }

    return sales;
  }

  async getSaleById(id: string): Promise<Sale | null> {
    const row = await DatabaseService.queryOne(
      'SELECT * FROM sales WHERE id = ?',
      [id]
    );
    if (!row) return null;

    const items = await DatabaseService.query(
      'SELECT * FROM sale_items WHERE sale_id = ?',
      [id]
    );

    return {
      id: row.id,
      saleDate: new Date(row.sale_date),
      total: row.total,
      subtotal: row.subtotal,
      tax: row.tax,
      discount: row.discount,
      paymentMethod: row.payment_method,
      clientId: row.client_id || undefined,
      userId: row.user_id,
      items: items.map((item: any) => ({
        id: item.id,
        saleId: item.sale_id,
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        total: item.total,
        profit: item.profit || undefined,
      })),
      status: row.status,
      createdAt: new Date(row.created_at),
    };
  }

  async getTodaySales(): Promise<Sale[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.getSales(today, tomorrow);
  }

  async getRevenue(dateFrom: Date, dateTo: Date): Promise<number> {
    const result = await DatabaseService.queryOne(
      'SELECT SUM(total) as revenue FROM sales WHERE sale_date BETWEEN ? AND ? AND status = "completed"',
      [dateFrom.toISOString(), dateTo.toISOString()]
    );
    return result?.revenue || 0;
  }

  async getSalesCount(dateFrom: Date, dateTo: Date): Promise<number> {
    const result = await DatabaseService.queryOne(
      'SELECT COUNT(*) as count FROM sales WHERE sale_date BETWEEN ? AND ? AND status = "completed"',
      [dateFrom.toISOString(), dateTo.toISOString()]
    );
    return result?.count || 0;
  }

  async getTopProducts(dateFrom: Date, dateTo: Date, limit: number = 10): Promise<any[]> {
    const results = await DatabaseService.query(
      SELECT 
        product_id, product_name, 
        SUM(quantity) as total_quantity,
        SUM(total) as total_revenue
      FROM sale_items 
      WHERE sale_id IN (
        SELECT id FROM sales 
        WHERE sale_date BETWEEN ? AND ? 
        AND status = "completed"
      )
      GROUP BY product_id 
      ORDER BY total_quantity DESC 
      LIMIT ?,
      [dateFrom.toISOString(), dateTo.toISOString(), limit]
    );
    return results;
  }

  async getDailyStats(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const revenue = await this.getRevenue(today, tomorrow);
    const count = await this.getSalesCount(today, tomorrow);

    return { revenue, count, date: today };
  }

  async getMonthlyStats(): Promise<any> {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const revenue = await this.getRevenue(firstDay, lastDay);
    const count = await this.getSalesCount(firstDay, lastDay);

    return { revenue, count, month: now.getMonth(), year: now.getFullYear() };
  }

  async cancelSale(id: string): Promise<boolean> {
    const sale = await this.getSaleById(id);
    if (!sale || sale.status === 'cancelled') return false;

    await DatabaseService.transaction(async () => {
      // Restaurer le stock
      for (const item of sale.items) {
        await StockService.updateStock(item.productId, item.quantity);
      }

      // Annuler la vente
      await DatabaseService.execute(
        'UPDATE sales SET status = ? WHERE id = ?',
        ['cancelled', id]
      );
    });

    return true;
  }
}

export default SalesService.getInstance();
