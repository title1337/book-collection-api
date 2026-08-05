import connectionPool from '../utils/db.js';

async function findAllBooksByOwner(owenerId) {
  const query = `
        SELECT 
            books.id,
            books.title,
            books.author,
            books.genre,
            books.published_year,
            books.owner_id,
            books.created_at
        FROM books
        WHERE books.owen_id = $1
        ORDER BY book.created_at DECS
    `;
  const values = [owenerId];

  const result = await connectionPool.query(query, values);

  return result.rows;
}

async function findBooksByIdAndOwener(bookId, owenerId) {
  const query = `
        SELECT
            books.id,
            books.title,
            books.author,
            books.genre,
            books.published_year,
            books.owner_id,
            books.created_at
        FROM books
        WHERE books.id = $1
            AND books.owner_id = $2 
    `;
  const values = [bookId, owenerId];

  const result = await connectionPool.query(query, values);
  const book = result.rows[0];

  return book ?? null;
}

async function createBook(bookData, ownerId) {
  const query = `
        INSERT INTO books (title, author, genre, published_year, owner_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, title, author, genre, published_year, owner_id, created_at
    `;
  const values = [
    bookData.title,
    bookData.author,
    bookData.genre,
    bookData.publishedYear,
    ownerId,
  ];

  const result = await connectionPool.query(query, values);
  const newBook = result.rows[0];

  return newBook;
}

async function updateBookByIdAndOwener(bookId, bookData, ownerId) {
  const query = `
        UPDATE books
        SET
            title = $1,
            author = $2,
            genre = $3,
            published_year = $4
        WHERE books.id = $5
            AND books.owner_id = $6
        RETURNING id, title, author, genre, published_year, owner_id, created_at
    `;
  const values = [
    bookData.title,
    bookData.author,
    bookData.genre,
    bookData.publishedYear,
    bookId,
    ownerId,
  ];

  const result = await connectionPool.query(query, values);
  const updatedBook = result.rows[0];

  return updatedBook ?? null;
}

async function deleteBookByIdAndOwner(bookId, ownerId) {
  const query = `
        DELETE FROM books
        WHERE books.id = $1
            AND books.owner_id = $2
        RETURNING id
    `;
  const values = [bookId, ownerId];

  const result = await connectionPool.query(query, values);
  const deletedBook = result.rows[0];

  return deletedBook ?? null;
}

export default {
  findAllBooksByOwner,
  findBooksByIdAndOwener,
  createBook,
  updateBookByIdAndOwener,
  deleteBookByIdAndOwner,
};
