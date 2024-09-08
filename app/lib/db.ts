import { Pool, QueryResult, QueryConfig } from 'pg';

// Create a new pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function query<T extends QueryResultRow>(text: string, params?: QueryConfig['values']): Promise<QueryResult<T>> {
  const client = await pool.connect();
  try {
    return await client.query<T>(text, params);
  } finally {
    client.release();
  }
}
