import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

function authenticate(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return next(new AppError('Access token is required', 401));
  }

  const isBearerFormat = authorizationHeader.startsWith('Bearer ');

  if (!isBearerFormat) {
    return next(new AppError('Invalid authorization format', 401));
  }

  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('Access token is required', 401));
  }

  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decodedPayload.userId,
      email: decodedPayload.email,
    };

    return next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401));
  }
}

export default authenticate;
