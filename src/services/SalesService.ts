// ============================================
// SERVICE DE GESTION DES VENTES (VERSION SIMPLIFIÉE)
// ============================================

import * as Crypto from 'expo-crypto';
import DatabaseService from './DatabaseService';
import StockService from './StockService';

export class SalesService {
  private static instance: SalesService;

  static getInstance(): SalesService {
    if (!SalesService.instance) {
      SalesService.instance = new SalesService();
    }
    return SalesService.instance;
  }

  // Crée une nouvelle vente
  async createSale(items: any[], paymentMethod: string, clientId?: string, userId?: string): Promise<any> {
    const saleId = await Crypto.randomUUID();
    const now = new Date().toISOString();
    let subtotal = 0;

    // Vérifier le stock
    for (const item of items) {
      const product = await StockService.getProductById(item.productId);
      if (!product) throw new Error('Produit non trouvé');
      if (product.stock < item.quantity) throw new Error('Stock insuffisant');
    }

    // Calculer le total
    for (const item of items) {
      subtotal += item.quantity * item.unitPrice;
    }

    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    // Insérer la vente
    await DatabaseService.execute(
      INSERT INTO sales (id, sale_date, total, subtotal, tax, payment_method, client_id, user_id, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
      [saleId, now, total, subtotal, tax, paymentMethod, clientId || null, userId || null, 'completed', now]
    );

    // Insérer les items et mettre à jour le stock
    for (const item of items) {
      const itemId = await Crypto.randomUUID();
      await DatabaseService.execute(
        INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, total)
         VALUES (?, ?, ?, ?, ?, ?, ?),
        [itemId, saleId, item.productId, item.productName, item.quantity, item.unitPrice, item.quantity * item.unitPrice]
      );
      await StockService.updateStock(item.productId, -item.quantity);
    }

    return { id: saleId, total, subtotal, tax, items, createdAt: now };
  }

  // Récupère toutes les ventes
  async getSales(): Promise<any[]> {
    return await DatabaseService.query('SELECT * FROM sales ORDER BY sale_date DESC');
  }

  // Récupère les ventes d'aujourd'hui
  async getTodaySales(): Promise<any[]> {
    const today = new Date().toISOString().split('T')[0];
    return await DatabaseService.query(
      'SELECT * FROM sales WHERE sale_date LIKE ? ORDER BY sale_date DESC',
      [${today}%]
    );
  }

  // Récupère le chiffre d'affaires sur une période
  async getRevenue(dateFrom: string, dateTo: string): Promise<number> {
    const result = await DatabaseService.queryOne(
      'SELECT SUM(total) as revenue FROM sales WHERE sale_date BETWEEN ? AND ?',
      [dateFrom, dateTo]
    );
    return result?.revenue || 0;
  }

  // Récupère le nombre de ventes sur une période
  async getSalesCount(dateFrom: string, dateTo: string): Promise<number> {
    const result = await DatabaseService.queryOne(
      'SELECT COUNT(*) as count FROM sales WHERE sale_date BETWEEN ? AND ?',
      [dateFrom, dateTo]
    );
    return result?.count || 0;
  }

  // Récupère les produits les plus vendus
  async getTopProducts(limit: number = 10): Promise<any[]> {
    return await DatabaseService.query(
      SELECT product_id, product_name, SUM(quantity) as total_quantity, SUM(total) as total_revenue
       FROM sale_items
       GROUP BY product_id
       ORDER BY total_quantity DESC
       LIMIT ?,
      [limit]
    );
  }

  // Statistiques du jour
  async getDailyStats(): Promise<any> {
    const today = new Date().toISOString().split('T')[0];
    const revenue = await this.getRevenue(today, today);
    const count = await this.getSalesCount(today, today);
    return { revenue, count, date: today };
  }

  // Statistiques du mois
  async getMonthlyStats(): Promise<any> {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    const revenue = await this.getRevenue(firstDay, lastDay);
    const count = await this.getSalesCount(firstDay, lastDay);
    return { revenue, count, month: now.getMonth() + 1, year: now.getFullYear() };
  }

  // Annuler une vente
  async cancelSale(id: string): Promise<boolean> {
    const sale = await DatabaseService.queryOne('SELECT * FROM sales WHERE id = ?', [id]);
    if (!sale || sale.status === 'cancelled') return false;

    const items = await DatabaseService.query('SELECT * FROM sale_items WHERE sale_id = ?', [id]);
    for (const item of items) {
      await StockService.updateStock(item.product_id, item.quantity);
    }

    await DatabaseService.execute('UPDATE sales SET status = ? WHERE id = ?', ['cancelled', id]);
    return true;
  }
}

export default SalesService.getInstance();

