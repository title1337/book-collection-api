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

export const createBook = asyncHandler(async (req, res) => {
  const ownerId = req.user.userId;
  const input = validateCreateBookInput(req.body);

  if (input.error) {
    throw new AppError(input.error, 400);
  }

  const newBook = await bookService.createBook(input.data, ownerId);

  return res.status(201).json({
    message: 'Book created successfully',
    data: newBook,
  });
});

export const updateBook = asyncHandler(async (req, res) => {
  const ownerId = req.user.userId;
  const bookId = parseBookId(req.params.bookId);

  if (!bookId) {
    throw new AppError('bookId must be a positive integer', 400);
  }

  const input = validateUpdateBookInput(req.body);

  if (input.error) {
    throw new AppError(input.error, 400);
  }

  const updatedBook = await bookService.updateBook(bookId, input.data, ownerId);

  return res.status(200).json({
    message: 'Book updated successfully',
    data: updatedBook,
  });
});

export const deleteBook = asyncHandler(async (req, res) => {
  const ownerId = req.user.userId;
  const bookId = parseBookId(req.params.bookId);

  if (!bookId) {
    throw new AppError('bookId must be a positive integer', 400);
  }

  await bookService.deleteBook(bookId, ownerId);

  return res.status(200).json({
    message: 'Book deleted successfully',
  });
});
