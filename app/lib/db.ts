import { Pool, QueryResult } from 'pg';

// Create a new pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function query(text: string, params?: any[]): Promise<QueryResult>{
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}
