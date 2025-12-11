import Voucher from '../models/Voucher.js';
import { validationResult } from 'express-validator';

// Apply voucher (validate ownership and status) - does not mark as used
export const applyVoucher = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Voucher code is required' });
    }

    const voucher = await Voucher.findOne({ code });
    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Voucher not found' });
    }

    if (!voucher.isActive || voucher.used) {
      return res.status(400).json({ success: false, message: 'Voucher is not active' });
    }

    if (voucher.assignedTo && voucher.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Voucher not assigned to this user' });
    }

    if (voucher.expiresAt && new Date() > voucher.expiresAt) {
      return res.status(400).json({ success: false, message: 'Voucher has expired' });
    }

    // Return voucher details for frontend to apply (BOGO semantics handled on frontend/cart)
    return res.status(200).json({
      success: true,
      message: 'Voucher valid',
      voucher: {
        code: voucher.code,
        type: voucher.type,
        value: voucher.value,
        expiresAt: voucher.expiresAt
      }
    });
  } catch (error) {
    console.error('Apply voucher error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Redeem voucher (mark as used) - call this at successful payment
export const redeemVoucher = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Voucher code is required' });

    const voucher = await Voucher.findOne({ code });
    if (!voucher) return res.status(404).json({ success: false, message: 'Voucher not found' });

    if (voucher.assignedTo && voucher.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Voucher not assigned to this user' });
    }

    if (!voucher.isActive || voucher.used) {
      return res.status(400).json({ success: false, message: 'Voucher cannot be redeemed' });
    }

    voucher.used = true;
    voucher.isActive = false;
    await voucher.save();

    return res.status(200).json({ success: true, message: 'Voucher redeemed' });
  } catch (err) {
    console.error('Redeem voucher error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
