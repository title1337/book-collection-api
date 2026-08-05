import { Router } from 'express';
import authenticate from '../middlewares/authenticate.middleware.js';
import {
  createBook,
  getAllBooks,
  getBooksByID,
} from '../controllers/book.controller.js';

const bookRouter = Router();

bookRouter.use(authenticate);

bookRouter.get('/', getAllBooks);
bookRouter.get('/:bookId', getBooksByID);
bookRouter.post('/', createBook);

export default bookRouter;
