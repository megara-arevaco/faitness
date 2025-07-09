import { PoolClient } from 'pg';
declare class Database {
    private pool;
    constructor();
    private initializePool;
    getClient(): Promise<PoolClient>;
    query(text: string, params?: any[]): Promise<any>;
    testConnection(): Promise<boolean>;
    close(): Promise<void>;
}
export declare const database: Database;
export default database;
//# sourceMappingURL=connection.d.ts.map