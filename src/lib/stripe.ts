import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
});

// Two-tier pricing structure
export const PLANS = {
  basic: {
    name: 'Basic',
    price: 19,
    priceId: process.env.STRIPE_BASIC_PRICE_ID!,
    features: [
      'Compliance deadline calendar',
      'Federal Register HIPAA updates',
      'State licensing renewal dates',
      'Filter by state and category',
    ],
  },
  pro: {
    name: 'Pro',
    price: 39,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      'Everything in Basic',
      'Email reminders (coming soon)',
      'Priority support',
      'Export to calendar apps',
    ],
  },
} as const;

export type PlanType = keyof typeof PLANS;

// Legacy support
export const PRICE_ID = process.env.STRIPE_BASIC_PRICE_ID || process.env.STRIPE_PRICE_ID!;
