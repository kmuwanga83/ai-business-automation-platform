import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    interval: 'month',
    features: ['100 AI generations/month', 'Email support', 'Basic automation']
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 99,
    interval: 'month',
    features: ['Unlimited AI generations', 'Priority support', 'Advanced automation', 'API access']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499,
    interval: 'month',
    features: ['Custom AI training', 'Dedicated support', 'SLA guarantee', 'White-label solution']
  }
];

export async function createCheckoutSession(customerEmail: string, planId: string) {
  try {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) throw new Error('Invalid plan');
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: plan.name,
            description: plan.features.join(', '),
          },
          unit_amount: plan.price * 100,
          recurring: { interval: plan.interval },
        },
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.APP_URL || 'http://localhost:3000'}/payment/success`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/payment/cancel`,
      customer_email: customerEmail,
    });
    
    return { success: true, sessionId: session.id, url: session.url };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getSubscriptionStatus(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'active',
    });
    
    return {
      success: true,
      isActive: subscriptions.data.length > 0,
      subscription: subscriptions.data[0] || null
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
