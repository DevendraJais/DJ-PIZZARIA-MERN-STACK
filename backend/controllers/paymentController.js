import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a payment intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'inr', metadata = {} } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) || amount < 1) {
      return res.status(400).json({ error: 'A valid amount is required' });
    }

    // Create a PaymentIntent with the order amount and currency
    // NOTE: Frontend already sends amount in the smallest currency unit (total * 100),
    // so we only need to round here, not multiply again.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // amount is already in paise for INR
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });

    // Send publishable key and PaymentIntent details to client
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
};

// Confirm payment and update order
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    // In a real app, you would verify the payment and update your database
    // For now, we'll just confirm the payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update your order in the database as paid
      // await Order.findByIdAndUpdate(orderId, { 
      //   paymentStatus: 'paid',
      //   status: 'confirmed'
      // });
      
      return res.status(200).json({
        success: true,
        message: 'Payment successful',
        paymentIntent
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment not successful',
        status: paymentIntent.status
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Webhook handler for Stripe events
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      // Update your database here
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      console.log('PaymentMethod was attached!', paymentMethod.id);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};
