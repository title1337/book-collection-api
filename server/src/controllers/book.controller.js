import asyncHandler from '../utils/asyncHandler.js';
import bookService from '../services/book.service.js';
import AppError from '../utils/AppError.js';
import {
  validateCreateBookInput,
  validateUpdateBookInput,
  parseBookId,
} from '../dtos/book.dto.js';

export const getAllBooks = asyncHandler(async (req, res) => {
  const ownerId = req.user.userId;
  const books = await bookService.getAllBooks(ownerId);

  return res.status(200).json({
    data: books,
  });
});

export const getBooksByID = asyncHandler(async (req, res) => {
  const ownerId = req.user.userId;
  const bookId = parseBookId(req.params.bookId);

  if (!bookId) {
    throw new AppError('bookId must be a positive integer', 400);
  }

  const book = await bookService.getBookById(bookId, ownerId);

  return res.status(200).json({
    data: book,
  });
});
