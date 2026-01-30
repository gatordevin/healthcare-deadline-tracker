import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { stripe, PRICE_ID } from '@/lib/stripe';

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.redirect(new URL('/sign-in', process.env.NEXT_PUBLIC_APP_URL));
    }

    // Check if user already has a Stripe customer ID
    let customerId = user.publicMetadata?.stripeCustomerId as string | undefined;

    if (!customerId) {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
        metadata: {
          clerkUserId: userId,
        },
      });
      customerId = customer.id;

      // Note: We'll update the Clerk user metadata via webhook after successful payment
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      metadata: {
        clerkUserId: userId,
      },
      subscription_data: {
        metadata: {
          clerkUserId: userId,
        },
      },
    });

    return NextResponse.redirect(session.url!);
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
