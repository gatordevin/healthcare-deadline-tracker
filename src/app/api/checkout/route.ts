import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server';
import { stripe, PLANS, PlanType } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.redirect(new URL('/sign-in', process.env.NEXT_PUBLIC_APP_URL));
    }

    // Get plan from query params (default to basic)
    const searchParams = request.nextUrl.searchParams;
    const planParam = searchParams.get('plan') as PlanType | null;
    const plan = planParam && PLANS[planParam] ? planParam : 'basic';
    const selectedPlan = PLANS[plan];

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
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        clerkUserId: userId,
        plan: plan,
      },
      subscription_data: {
        metadata: {
          clerkUserId: userId,
          plan: plan,
        },
      },
    });

    return NextResponse.redirect(session.url!);
  } catch (error) {
    console.error('Checkout error:', error);
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    // Return more details in development/for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: errorMessage,
        priceIdUsed: PLANS[request.nextUrl.searchParams.get('plan') as PlanType || 'basic']?.priceId || 'undefined'
      },
      { status: 500 }
    );
  }
}
