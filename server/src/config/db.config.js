import pg from 'pg';
import 'dotenv/config';

const { pool } = pg;

const connectionPool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgrespassword@localhost:5432/book_api',
});

connectionPool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error.message);
});

export default connectionPool;
