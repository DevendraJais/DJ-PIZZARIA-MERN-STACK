import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Voucher from '../models/Voucher.js';
import { validationResult } from 'express-validator';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// =====================
// REGISTER USER
// =====================
export const register = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      });
    }

    const { name, email, phone, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Create & assign a welcome BOGO voucher on registration
    try {
      const existing = await Voucher.findOne({ assignedTo: user._id, isActive: true, used: false });
      if (!existing) {
        const code = `BOGO-${Math.random().toString(36).substring(2,8).toUpperCase()}`;
        const v = new Voucher({ code, type: 'BOGO', assignedTo: user._id });
        await v.save();
        // include voucher in response
        res.status(201).json({
          success: true,
          message: 'User registered successfully',
          token,
          user: user.toJSON(),
          voucher: { code: v.code, type: v.type, expiresAt: v.expiresAt }
        });
        return;
      }
    } catch (err) {
      console.error('Voucher assignment error:', err.message);
    }

    // Send response (no voucher created or already exists)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error during registration'
    });
  }
};

// =====================
// LOGIN USER
// =====================
export const login = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      });
    }

    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Try assign welcome voucher on login if user doesn't already have one
    try {
      const existing = await Voucher.findOne({ assignedTo: user._id, isActive: true, used: false });
      if (!existing) {
        const code = `BOGO-${Math.random().toString(36).substring(2,8).toUpperCase()}`;
        const v = new Voucher({ code, type: 'BOGO', assignedTo: user._id });
        await v.save();
        res.status(200).json({
          success: true,
          message: 'Login successful',
          token,
          user: user.toJSON(),
          voucher: { code: v.code, type: v.type, expiresAt: v.expiresAt }
        });
        return;
      }
    } catch (err) {
      console.error('Voucher assignment error on login:', err.message);
    }

    // Send response (no new voucher)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error during login'
    });
  }
};

// =====================
// GET CURRENT USER
// =====================
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user'
    });
  }
};

// =====================
// UPDATE USER PROFILE
// =====================
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, city, zipCode } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (city) user.city = city;
    if (zipCode) user.zipCode = zipCode;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile'
    });
  }
};

// =====================
// CHANGE PASSWORD
// =====================
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error changing password'
    });
  }
};
