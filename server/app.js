import 'dotenv/config';
import express from 'express';
import connectionPool from './src/utils/db.js';
import errorHandlerMiddleware from './src/middlewares/errorHandler.middleware.js';
import authRouter from './src/routes/auth.routes.js';

const app = express();
const port = Number(process.env.PORT);

app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await connectionPool.query(`SELECT 1 AS ready`);

    return res.status(200).json({
      status: 'ok',
      database: 'connected',
    });
  } catch (error) {
    console.error('[GET /health] error', error.message);
    return res.status(503).json({
      status: 'error',
      database: 'disconnected',
    });
  }
});

app.use('/api/auth', authRouter);
app.use(errorHandlerMiddleware);

app.use((req, res) => {
  return res.status(404).json({
    message: 'Route not found',
  });
});

app.listen(port, () => {
  console.log(`Book API running at http://localhost:${port}`);
});
