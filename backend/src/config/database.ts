import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'learning_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

export const db = {
    async query<T = any>(sql: string, values?: any[]): Promise<T[]> {
        const [rows] = await pool.execute(sql, values);
        return rows as T[];
    },

    async queryOne<T = any>(sql: string, values?: any[]): Promise<T | null> {
        const [rows] = await pool.execute(sql, values);
        const results = rows as T[];
        return results.length > 0 ? results[0] : null;
    },

    async transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            const result = await callback(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    getPool() {
        return pool;
    }
};

export default pool;
