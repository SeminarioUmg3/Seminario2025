import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    console.log('Conexión a PostgreSQL establecida correctamente');
  } finally {
    client.release();
  }
}

export { pool, initializeDatabase };
