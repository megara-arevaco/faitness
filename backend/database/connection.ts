import { Pool, PoolClient } from 'pg';
import { dbConfig } from './config';

class Database {
  private pool: Pool;

  constructor() {
    this.pool = new Pool(dbConfig);
    this.initializePool();
  }

  private initializePool() {
    this.pool.on('connect', () => {
      console.log('Connected to PostgreSQL database');
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async query(text: string, params?: any[]): Promise<any> {
    const client = await this.getClient();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const client = await this.getClient();
      await client.query('SELECT NOW()');
      client.release();
      console.log('Database connection test successful');
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
    console.log('Database connection pool closed');
  }
}

export const database = new Database();
export default database;