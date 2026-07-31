import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const connectionPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

connectionPool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error.message);
});

export default connectionPool;
