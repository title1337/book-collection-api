import asyncHandler from '../utils/asyncHandler.js';
import authService from '../services/auth.service.js';
import { validateRegisterInput, validateLoginInput } from '../dtos/auth.dto.js';
import AppError from '../utils/AppError.js';

export const registerUser = asyncHandler(async (req, res) => {
  const input = validateRegisterInput(req.body);

  if (input.error) {
    throw new AppError(input.error, 400);
  }

  const newUser = await authService.register(
    input.data.email,
    input.data.password,
  );

  return res.status(201).json({
    message: 'Register successful',
    data: newUser,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const input = validateLoginInput(req.body);

  if (input.error) {
    throw new AppError(input.error, 400);
  }

  const result = await authService.login(input.data.email, input.data.password);

  return res.status(200).json({
    message: 'Login successful',
    token: result.token,
    user: result.user,
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    message: 'Logout successful',
  });
});
