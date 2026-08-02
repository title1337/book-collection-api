import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';
import AppError from '../utils/AppError.js';

const SALT_ROUNDS = 10;
const TOKEN_EXPIRES_IN = '2h';

async function register(email, password) {
  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const newUser = await userRepository.createUser(email, passwordHash);

  return newUser;
}

async function login(email, password) {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRES_IN,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
}

export default {
  register,
  login,
};
