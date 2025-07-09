"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const pg_1 = require("pg");
const config_1 = require("./config");
class Database {
    constructor() {
        this.pool = new pg_1.Pool(config_1.dbConfig);
        this.initializePool();
    }
    initializePool() {
        this.pool.on('connect', () => {
            console.log('Connected to PostgreSQL database');
        });
        this.pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
    }
    async getClient() {
        return this.pool.connect();
    }
    async query(text, params) {
        const client = await this.getClient();
        try {
            const result = await client.query(text, params);
            return result;
        }
        finally {
            client.release();
        }
    }
    async testConnection() {
        try {
            const client = await this.getClient();
            await client.query('SELECT NOW()');
            client.release();
            console.log('Database connection test successful');
            return true;
        }
        catch (error) {
            console.error('Database connection test failed:', error);
            return false;
        }
    }
    async close() {
        await this.pool.end();
        console.log('Database connection pool closed');
    }
}
exports.database = new Database();
exports.default = exports.database;
//# sourceMappingURL=connection.js.map