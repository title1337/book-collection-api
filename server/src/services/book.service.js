import bookRepository from '../repositories/book.repository';
import AppError from '../utils/AppError';

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

async function updateBook(bookId, bookData, owenerId) {
  const updateBook = await bookRepository.updateBook(
    bookId,
    bookData,
    owenerId,
  );

  if (!updateBook) {
    throw new AppError('Book not found', 404);
  }

  return updateBook;
}

async function deleteBook(bookId, owenerId) {
  const deletedBook = await bookRepository.deleteBookByIdAndOwner(
    bookId,
    owenerId,
  );

  if (!deleteBook) {
    throw new AppError('Book not found', 404);
  }

  return deleteBook;
}

export default {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
