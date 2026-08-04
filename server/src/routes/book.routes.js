import { Router } from 'express';
import authenticate from '../middlewares/authenticate.middleware.js';
import { getAllBooks } from '../controllers/book.controller.js';

const bookRouter = Router();

bookRouter.use(authenticate);

bookRouter.get('/', getAllBooks);

export default bookRouter;
