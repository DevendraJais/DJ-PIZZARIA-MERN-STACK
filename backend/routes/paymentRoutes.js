import express from 'express';
import { createPaymentIntent, confirmPayment, handleWebhook } from '../controllers/paymentController.js';

const router = express.Router();

// Create a payment intent
router.post('/create-payment-intent', createPaymentIntent);

// Confirm payment and update order
router.post('/confirm-payment', confirmPayment);

// Stripe webhook handler
router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);

export default router;
