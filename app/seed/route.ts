import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

const { 
  POSTGRES_USER, 
  POSTGRES_HOST, 
  POSTGRES_PASSWORD, 
  POSTGRES_PORT 
} = process.env;

const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || 'your_default_db_name';

// First, connect to the default 'postgres' database
const pool = new Pool({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: 'postgres', // Connect to default database initially
  password: POSTGRES_PASSWORD,
  port: parseInt(POSTGRES_PORT || '5432'),
});

async function createDatabaseIfNotExists() {
  const client = await pool.connect();
  try {
    // Check if the database exists
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname=$1",
      [POSTGRES_DATABASE]
    );

    if (res.rowCount === 0) {
      // Database doesn't exist, so create it
      await client.query(`CREATE DATABASE ${POSTGRES_DATABASE}`);
      console.log(`Database ${POSTGRES_DATABASE} created.`);
    } else {
      console.log(`Database ${POSTGRES_DATABASE} already exists.`);
    }
  } finally {
    client.release();
  }
}

// Function to get a connection to the specific database
async function getDbConnection() {
  return new Pool({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    password: POSTGRES_PASSWORD,
    port: parseInt(POSTGRES_PORT || '5432'),
  });
}

async function seedUsers(client) {
  await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.query(`
        INSERT INTO users (id, name, email, password)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING;
      `, [user.id, user.name, user.email, hashedPassword]);
    }),
  );

  return insertedUsers;
}

async function seedInvoices(client) {
  await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  await client.query(`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `);

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => client.query(`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING;
      `, [invoice.customer_id, invoice.amount, invoice.status, invoice.date]),
    ),
  );

  return insertedInvoices;
}

async function seedCustomers(client) {
  await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  await client.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `);

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => client.query(`
        INSERT INTO customers (id, name, email, image_url)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING;
      `, [customer.id, customer.name, customer.email, customer.image_url]),
    ),
  );

  return insertedCustomers;
}

async function seedRevenue(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `);

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => client.query(`
        INSERT INTO revenue (month, revenue)
        VALUES ($1, $2)
        ON CONFLICT (month) DO NOTHING;
      `, [rev.month, rev.revenue]),
    ),
  );

  return insertedRevenue;
}

export async function GET() {
  try {
    // First, ensure the database exists
    await createDatabaseIfNotExists();

    // Now connect to the specific database
    const dbPool = await getDbConnection();

    const client = await dbPool.connect();
    try {
      await client.query('BEGIN');
      await seedUsers(client);
      await seedCustomers(client);
      await seedInvoices(client);
      await seedRevenue(client);
      await client.query('COMMIT');

      return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Seeding error:', error);
      return Response.json({ error: error.message || 'Unknown error occurred' }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database creation/connection error:', error);
    return Response.json({ error: error.message || 'Database setup failed' }, { status: 500 });
  }
}
