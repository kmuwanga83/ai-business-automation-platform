import { Router } from 'express';
import { createCheckoutSession, getSubscriptionStatus, PLANS } from '../../agents/paymentAgent';

const router = Router();

// Get available plans
router.get('/plans', (req, res) => {
  res.json({ success: true, plans: PLANS });
});

// Create checkout session
router.post('/create-checkout', async (req, res) => {
  const { email, planId } = req.body;
  
  if (!email || !planId) {
    return res.status(400).json({ error: 'Email and planId are required' });
  }
  
  const result = await createCheckoutSession(email, planId);
  res.json(result);
});

// Check subscription status
router.get('/status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const result = await getSubscriptionStatus(customerId);
  res.json(result);
});

// Webhook for Stripe events
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  // Verify webhook signature and handle events
  res.json({ received: true });
});

export default router;
