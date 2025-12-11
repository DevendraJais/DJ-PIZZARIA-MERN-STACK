import express from 'express';
import { applyVoucher, redeemVoucher } from '../controllers/voucherController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validate voucher (doesn't mark as used)
router.post('/apply', protect, applyVoucher);

// Redeem voucher after successful payment
router.post('/redeem', protect, redeemVoucher);

export default router;
