// ============================================
// SERVICE D'ANALYTIQUE
// ============================================

import SalesService from './SalesService';
import StockService from './StockService';
import ClientService from './ClientService';
import { formatDate } from '../utils/dateUtils';

export class AnalyticsService {
  private static instance: AnalyticsService;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async getDashboardStats(): Promise<any> {
    try {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const [todaySales, monthlySales, stockStats, clientStats] = await Promise.all([
        SalesService.getTodaySales(),
        SalesService.getSales(firstDay, today),
        this.getStockStats(),
        ClientService.getClientStats(),
      ]);

      const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
      const todayCount = todaySales.length;
      const monthlyRevenue = monthlySales.reduce((sum, s) => sum + s.total, 0);
      const monthlyCount = monthlySales.length;

      return {
        revenue: {
          today: todayRevenue,
          month: monthlyRevenue,
        },
        sales: {
          today: todayCount,
          month: monthlyCount,
        },
        stock: stockStats,
        clients: clientStats,
      };
    } catch (error) {
      console.error('❌ Erreur stats dashboard:', error);
      return null;
    }
  }

  private async getStockStats(): Promise<any> {
    try {
      const [total, lowStock, outOfStock] = await Promise.all([
        StockService.getStockCount(),
        StockService.getLowStockProducts(),
        StockService.getOutOfStockProducts(),
      ]);

      return {
        total,
        lowStock: lowStock.length,
        outOfStock: outOfStock.length,
        lowStockItems: lowStock,
        outOfStockItems: outOfStock,
      };
    } catch (error) {
      console.error('❌ Erreur stats stock:', error);
      return { total: 0, lowStock: 0, outOfStock: 0 };
    }
  }

  async getTopProducts(limit: number = 10): Promise<any[]> {
    try {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      return await SalesService.getTopProducts(firstDay, today, limit);
    } catch (error) {
      console.error('❌ Erreur top produits:', error);
      return [];
    }
  }

  async getSalesChart(days: number = 7): Promise<any[]> {
    try {
      const data = [];
      const today = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        const revenue = await SalesService.getRevenue(start, end);
        const count = await SalesService.getSalesCount(start, end);

        data.push({
          date: formatDate(date),
          revenue,
          count,
        });
      }

      return data;
    } catch (error) {
      console.error('❌ Erreur chart ventes:', error);
      return [];
    }
  }
}

export default AnalyticsService.getInstance();
