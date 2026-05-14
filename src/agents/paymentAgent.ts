// Payment Agent - Ready for Stripe integration
// To enable real payments: Add STRIPE_SECRET_KEY to .env

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

// Check if Stripe is configured
let stripeConfigured = false;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    // We'll import Stripe dynamically only when needed
    stripeConfigured = true;
  }
} catch (error) {
  console.log('Stripe not configured - running in demo mode');
}

export async function createCheckoutSession(customerEmail: string, planId: string) {
  // Demo mode response
  if (!process.env.STRIPE_SECRET_KEY) {
    console.log(`[DEMO] Creating checkout for ${customerEmail} with plan ${planId}`);
    return { 
      success: true, 
      sessionId: 'demo_' + Date.now(),
      url: '#',
      demo: true,
      message: 'Demo mode: Add STRIPE_SECRET_KEY to .env to enable real payments.'
    };
  }
  
  // Real Stripe integration would go here
  try {
    // Dynamic import to avoid initialization issues
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
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
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      success: true,
      isActive: false,
      subscription: null,
      demo: true,
      message: 'Demo mode: Subscription status checking available with Stripe keys'
    };
  }
  
  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
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
