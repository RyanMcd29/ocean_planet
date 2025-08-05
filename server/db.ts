import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon for serverless environments
neonConfig.webSocketConstructor = ws;
neonConfig.useSecureWebSocket = true;
neonConfig.pipelineConnect = false;
// Set fetch function for serverless
neonConfig.fetchFunction = fetch;

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
  max: 1, // Limit connections for development
  ssl: true, // Explicitly enable SSL
  connectionTimeoutMillis: 10000, // 10 second timeout
});

// Test the connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const db = drizzle({ client: pool, schema });
