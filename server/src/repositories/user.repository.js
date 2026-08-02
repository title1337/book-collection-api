import connectionPool from './src/utils/db.js';

async function findUserByEmail(email) {
  const query = `
    SELECT 
        id,
        email,
        password_hash,
        created_at
    FROM users
    WHERE email = $1
    `;
  const values = [email];

  const result = await connectionPool.query(query, values);
  const user = result.rows[0];

  return user ?? null;
}

async function createUser(email, passwordHash) {
  const query = `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email, created_at
    `;

  const values = [email, passwordHash];

  const result = await connectionPool.query(query, values);
  const newUser = result.rows[0];

  return newUser;
}

export default {
  findUserByEmail,
  createUser,
};
