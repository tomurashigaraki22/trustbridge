import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function migrateDatabase() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true,
  });

  const connection = await pool.getConnection();

  try {
    console.log('Starting database migration...');

    // Temporarily disable primary key requirement
    await connection.query('SET SESSION sql_require_primary_key = 0;');

    // Read SQL file
    const sqlFilePath = path.join(process.cwd(), 'public', 'migrate.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('Dropping existing tables...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    const [tables] = await connection.query('SHOW TABLES;');
    for (const table of tables as any[]) {
      const tableName = table[`Tables_in_${process.env.DB_DATABASE}`];
      console.log(`Dropping table: ${tableName}`);
      await connection.query(`DROP TABLE IF EXISTS ${tableName};`);
    }
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

    console.log('Executing migration script...');
    await connection.query(sql);

    console.log('Database migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Re-enable primary key requirement
    await connection.query('SET SESSION sql_require_primary_key = 1;');
    connection.release();
    await pool.end();
  }
}

migrateDatabase();