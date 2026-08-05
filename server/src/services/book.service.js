import bookRepository from '../repositories/book.repository.js';
import AppError from '../utils/AppError.js';

async function getAllBooks(owenerId) {
  const books = await bookRepository.findAllBooksByOwner(owenerId);
  return books;
}

async function getBookById(bookId, owenerId) {
  const book = await bookRepository.findBookByIdAndOwner(bookId, owenerId);
  if (!book) {
    throw new AppError('Book not found', 404);
  }

  return book;
}

async function createBook(bookData, owenerId) {
  const newBook = await bookRepository.createBook(bookData, owenerId);

  return newBook;
}

async function updateBook(bookId, bookData, ownerId) {
  const updateBook = await bookRepository.updateBookByIdAndOwener(
    bookId,
    bookData,
    ownerId,
  );

  if (!updateBook) {
    throw new AppError('Book not found', 404);
  }

  return updateBook;
}

async function deleteBook(bookId, ownerId) {
  const deletedBook = await bookRepository.deleteBookByIdAndOwner(
    bookId,
    ownerId,
  );

  if (!deletedBook) {
    throw new AppError('Book not found', 404);
  }

  return deletedBook;
}

export default {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
