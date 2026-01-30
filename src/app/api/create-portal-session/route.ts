import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.redirect(new URL('/sign-in', process.env.NEXT_PUBLIC_APP_URL));
    }

    const customerId = user.publicMetadata?.stripeCustomerId as string | undefined;

    if (!customerId) {
      return NextResponse.redirect(
        new URL('/dashboard?error=no-subscription', process.env.NEXT_PUBLIC_APP_URL)
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return NextResponse.redirect(portalSession.url);
  } catch (error) {
    console.error('Portal session error:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
