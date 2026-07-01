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
    return results.map(this.mapClient);
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

  async createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'loyaltyPoints' | 'totalPurchases'>): Promise<Client> {
    const id = await Crypto.randomUUID();
    const now = new Date().toISOString();

    await DatabaseService.execute(
      INSERT INTO clients (
        id, name, phone, email, address, loyalty_points, total_purchases, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?),
      [
        id,
        data.name,
        data.phone || null,
        data.email || null,
        data.address || null,
        0,
        0,
        now,
        now,
      ]
    );

    return {
      ...data,
      id,
      loyaltyPoints: 0,
      totalPurchases: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async createClients(clients: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'loyaltyPoints' | 'totalPurchases'>[]): Promise<Client[]> {
    const created: Client[] = [];
    for (const client of clients) {
      const c = await this.createClient(client);
      created.push(c);
    }
    return created;
  }

  async updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
    if (updates.phone !== undefined) { fields.push('phone = ?'); values.push(updates.phone); }
    if (updates.email !== undefined) { fields.push('email = ?'); values.push(updates.email); }
    if (updates.address !== undefined) { fields.push('address = ?'); values.push(updates.address); }
    if (updates.loyaltyPoints !== undefined) { fields.push('loyalty_points = ?'); values.push(updates.loyaltyPoints); }
    if (updates.totalPurchases !== undefined) { fields.push('total_purchases = ?'); values.push(updates.totalPurchases); }

    if (fields.length === 0) return null;

    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    await DatabaseService.execute(
      UPDATE clients SET  WHERE id = ?,
      values
    );

    return await this.getClientById(id);
  }

  async deleteClient(id: string): Promise<boolean> {
    await DatabaseService.execute('DELETE FROM clients WHERE id = ?', [id]);
    return true;
  }

  async addLoyaltyPoints(id: string, points: number): Promise<Client | null> {
    const client = await this.getClientById(id);
    if (!client) return null;
    return await this.updateClient(id, { loyaltyPoints: client.loyaltyPoints + points });
  }

  async getTopClients(limit: number = 10): Promise<Client[]> {
    const results = await DatabaseService.query(
      'SELECT * FROM clients ORDER BY total_purchases DESC LIMIT ?',
      [limit]
    );
    return results.map(this.mapClient);
  }

  async searchClients(query: string): Promise<Client[]> {
    const results = await DatabaseService.query(
      'SELECT * FROM clients WHERE name LIKE ? OR phone LIKE ? OR email LIKE ? ORDER BY name',
      [%%, %%, %%]
    );
    return results.map(this.mapClient);
  }

  async getClientStats(): Promise<{
    total: number;
    active: number;
    new: number;
    averageLoyalty: number;
  }> {
    const total = await DatabaseService.queryOne(
      'SELECT COUNT(*) as count FROM clients'
    );

    const active = await DatabaseService.queryOne(
      'SELECT COUNT(*) as count FROM clients WHERE last_purchase_date >= ?',
      [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()]
    );

    const newClients = await DatabaseService.queryOne(
      'SELECT COUNT(*) as count FROM clients WHERE created_at >= ?',
      [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()]
    );

    const avgLoyalty = await DatabaseService.queryOne(
      'SELECT AVG(loyalty_points) as avg FROM clients'
    );

    return {
      total: total?.count || 0,
      active: active?.count || 0,
      new: newClients?.count || 0,
      averageLoyalty: avgLoyalty?.avg || 0,
    };
  }

  private mapClient(data: any): Client {
    return {
      id: data.id,
      name: data.name,
      phone: data.phone || undefined,
      email: data.email || undefined,
      address: data.address || undefined,
      loyaltyPoints: data.loyalty_points,
      totalPurchases: data.total_purchases,
      lastPurchaseDate: data.last_purchase_date ? new Date(data.last_purchase_date) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}

export default ClientService.getInstance();

