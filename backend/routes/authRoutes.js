import express from 'express';
import { body, param } from 'express-validator';
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword
} from '../controllers/authController.js';
import { protect, verifyToken } from '../middleware/auth.js';

const router = express.Router();

// =====================
// PUBLIC ROUTES
// =====================

// Register
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').matches(/^\d{10}$/).withMessage('Phone must be exactly 10 digits'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], register);

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Please provide a password')
], login);

// Verify token
router.get('/verify', verifyToken);

// =====================
// PROTECTED ROUTES
// =====================

// Get current user
router.get('/me', protect, getCurrentUser);

// Update profile
router.put('/profile', protect, updateProfile);

// Change password
router.post('/change-password', protect, [
  body('currentPassword').exists().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], changePassword);

export default router;
