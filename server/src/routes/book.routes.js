import { Router } from 'express';
import authenticate from '../middlewares/authenticate.middleware.js';
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBooksByID,
  updateBook,
} from '../controllers/book.controller.js';

const bookRouter = Router();

bookRouter.use(authenticate);

bookRouter.get('/', getAllBooks);
bookRouter.get('/:bookId', getBooksByID);
bookRouter.post('/', createBook);
bookRouter.put('/:bookId', updateBook);
bookRouter.delete('/:bookId', deleteBook);

export default bookRouter;
