import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Parse the connection string to check for issues
const connectionString = process.env.DATABASE_URL;
console.log('Database connection string exists:', !!connectionString);
console.log('Connection string starts with:', connectionString.substring(0, 30) + '...');

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10, // Increase connection pool for better performance
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 30000, // 30 second timeout
  idleTimeoutMillis: 30000,
});

// Test the connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const db = drizzle(pool, { schema });
