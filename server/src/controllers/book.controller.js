import asyncHandler from '../utils/asyncHandler';
import bookService from '../services/book.service';
import AppError from '../utils/AppError';
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
