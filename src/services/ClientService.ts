// ============================================
// SERVICE DE GESTION DES CLIENTS
// ============================================

import * as Crypto from 'expo-crypto';
import DatabaseService from './DatabaseService';
import type { Client } from '../types';

export class ClientService {
  private static instance: ClientService;

  static getInstance(): ClientService {
    if (!ClientService.instance) {
      ClientService.instance = new ClientService();
    }
    return ClientService.instance;
  }

  async getAllClients(): Promise<Client[]> {
    const results = await DatabaseService.query(
      'SELECT * FROM clients ORDER BY name'
    );
    return results.map((row: any) => this.mapClient(row));
  }

  async getClientById(id: string): Promise<Client | null> {
    const result = await DatabaseService.queryOne(
      'SELECT * FROM clients WHERE id = ?',
      [id]
    );
    return result ? this.mapClient(result) : null;
  }

  async getClientByPhone(phone: string): Promise<Client | null> {
    const result = await DatabaseService.queryOne(
      'SELECT * FROM clients WHERE phone = ?',
      [phone]
    );
    return result ? this.mapClient(result) : null;
  }

  async getClientByEmail(email: string): Promise<Client | null> {
    const result = await DatabaseService.queryOne(
      'SELECT * FROM clients WHERE email = ?',
      [email]
    );
    return result ? this.mapClient(result) : null;
  }

  async createClient(data: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  }): Promise<Client> {
    const id = await Crypto.randomUUID();
    const now = new Date().toISOString();

    await DatabaseService.execute(
      'INSERT INTO clients (id, name, phone, email, address, loyalty_points, total_purchases, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        data.name,
        data.phone || null,
        data.email || null,
        data.address || null,
        0,
        0,
        now,
        now
      ]
    );

    return {
      id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      loyaltyPoints: 0,
      totalPurchases: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.phone !== undefined) {
      fields.push('phone = ?');
      values.push(updates.phone);
    }
    if (updates.email !== undefined) {
      fields.push('email = ?');
      values.push(updates.email);
    }
    if (updates.address !== undefined) {
      fields.push('address = ?');
      values.push(updates.address);
    }
    if (updates.loyaltyPoints !== undefined) {
      fields.push('loyalty_points = ?');
      values.push(updates.loyaltyPoints);
    }
    if (updates.totalPurchases !== undefined) {
      fields.push('total_purchases = ?');
      values.push(updates.totalPurchases);
    }

    if (fields.length === 0) {
      return null;
    }

    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    await DatabaseService.execute(
      `UPDATE clients SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.getClientById(id);
  }

  async deleteClient(id: string): Promise<boolean> {
    await DatabaseService.execute(
      'DELETE FROM clients WHERE id = ?',
      [id]
    );
    return true;
  }

  async addLoyaltyPoints(id: string, points: number): Promise<Client | null> {
    const client = await this.getClientById(id);
    if (!client) {
      return null;
    }
    return this.updateClient(id, {
      loyaltyPoints: (client.loyaltyPoints || 0) + points
    });
  }

  async searchClients(query: string): Promise<Client[]> {
    const searchTerm = `%${query}%`;
    const results = await DatabaseService.query(
      `SELECT * FROM clients 
       WHERE name LIKE ? 
       OR phone LIKE ? 
       OR email LIKE ? 
       ORDER BY name`,
      [searchTerm, searchTerm, searchTerm]
    );
    return results.map((row: any) => this.mapClient(row));
  }

  async getClientStats(): Promise<{
    total: number;
    active: number;
    new: number;
    averageLoyalty: number;
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const totalResult = await DatabaseService.queryOne(
      'SELECT COUNT(*) as count FROM clients'
    );

    const activeResult = await DatabaseService.queryOne(
      'SELECT COUNT(*) as count FROM clients WHERE last_purchase_date >= ?',
      [thirtyDaysAgo.toISOString()]
    );

    const newResult = await DatabaseService.queryOne(
      'SELECT COUNT(*) as count FROM clients WHERE created_at >= ?',
      [thirtyDaysAgo.toISOString()]
    );

    const avgResult = await DatabaseService.queryOne(
      'SELECT AVG(loyalty_points) as avg FROM clients'
    );

    return {
      total: totalResult?.count || 0,
      active: activeResult?.count || 0,
      new: newResult?.count || 0,
      averageLoyalty: avgResult?.avg || 0
    };
  }

  private mapClient(row: any): Client {
    return {
      id: row.id,
      name: row.name,
      phone: row.phone || undefined,
      email: row.email || undefined,
      address: row.address || undefined,
      loyaltyPoints: row.loyalty_points || 0,
      totalPurchases: row.total_purchases || 0,
      lastPurchaseDate: row.last_purchase_date ? new Date(row.last_purchase_date) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
}

export default ClientService.getInstance();