import express from 'express';
import { createOrder } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create an order (cart + optional voucher)
router.post('/', protect, createOrder);

export default router;
