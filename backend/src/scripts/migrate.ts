import fs from 'fs';
import path from 'path';
import pool from '../config/database';

const runMigrations = async () => {
    try {
        const migrationsDir = path.join(__dirname, '../../migrations');
        const files = fs.readdirSync(migrationsDir).sort();

        console.log('Running migrations...');

        for (const file of files) {
            if (file.endsWith('.sql')) {
                console.log(`Running: ${file}`);
                const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
                
                // Split SQL by semicolons to handle multiple statements
                const statements = sql.split(';').filter(s => s.trim());
                
                for (const statement of statements) {
                    if (statement.trim()) {
                        await pool.execute(statement);
                    }
                }
                
                console.log(`Completed: ${file}`);
            }
        }

        console.log('All migrations completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

runMigrations();
