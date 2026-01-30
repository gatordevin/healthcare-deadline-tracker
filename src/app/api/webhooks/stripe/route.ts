import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { clerkClient } from '@clerk/nextjs/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkUserId = session.metadata?.clerkUserId;
        const customerId = session.customer as string;

        if (clerkUserId) {
          const client = await clerkClient();
          await client.users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
              stripeCustomerId: customerId,
              subscriptionStatus: 'active',
            },
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const clerkUserId = subscription.metadata?.clerkUserId;

        if (clerkUserId) {
          const client = await clerkClient();
          await client.users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
              subscriptionStatus: subscription.status,
              subscriptionId: subscription.id,
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const clerkUserId = subscription.metadata?.clerkUserId;

        if (clerkUserId) {
          const client = await clerkClient();
          await client.users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
              subscriptionStatus: 'canceled',
              subscriptionId: null,
            },
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const clerkUserId = subscription.metadata?.clerkUserId;

          if (clerkUserId) {
            const client = await clerkClient();
            await client.users.updateUserMetadata(clerkUserId, {
              publicMetadata: {
                subscriptionStatus: 'active',
              },
            });
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const clerkUserId = subscription.metadata?.clerkUserId;

          if (clerkUserId) {
            const client = await clerkClient();
            await client.users.updateUserMetadata(clerkUserId, {
              publicMetadata: {
                subscriptionStatus: 'past_due',
              },
            });
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
