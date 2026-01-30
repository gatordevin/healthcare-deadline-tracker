'use client';

import { useUser } from '@clerk/nextjs';
import { SignUpButton } from '@clerk/nextjs';
import { Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PricingContent() {
  const { isSignedIn, user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const canceled = searchParams.get('canceled');

  const subscriptionStatus = user?.publicMetadata?.subscriptionStatus as string | undefined;
  const hasActiveSubscription = subscriptionStatus === 'active';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-slate-800">Healthcare Compliance Tracker</span>
            </div>
            <div className="w-16" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        {canceled && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-center">
            Checkout was canceled. You can try again when you&apos;re ready.
          </div>
        )}

        <div className="text-center mb-14">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-slate-600">
            Select the subscription that fits your compliance needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Basic</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">$19</span>
              <span className="text-slate-600">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-slate-700">Access to compliance deadline calendar</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-slate-700">Federal Register HIPAA updates</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-slate-700">State licensing renewal dates</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-slate-700">Filter by state and category</span>
              </li>
            </ul>
            {isSignedIn ? (
              hasActiveSubscription ? (
                <div className="w-full py-3 px-4 bg-slate-100 rounded-lg text-slate-500 font-medium text-center">
                  Current Plan
                </div>
              ) : (
                <a
                  href="/api/checkout?plan=basic"
                  className="block w-full py-3 px-4 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors text-center"
                >
                  Subscribe to Basic
                </a>
              )
            ) : (
              <SignUpButton mode="modal">
                <button className="w-full py-3 px-4 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                  Get Started
                </button>
              </SignUpButton>
            )}
          </div>

          {/* Pro Plan */}
          <div className="bg-slate-900 rounded-xl p-8 text-white relative shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                Recommended
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$39</span>
              <span className="text-slate-400">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-slate-200">Everything in Basic</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-slate-200">Email reminders (coming soon)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-slate-200">Priority support</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-slate-200">Export to calendar apps</span>
              </li>
            </ul>
            {isSignedIn ? (
              hasActiveSubscription ? (
                <a
                  href="/api/checkout?plan=pro"
                  className="block w-full py-3 px-4 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors text-center"
                >
                  Upgrade to Pro
                </a>
              ) : (
                <a
                  href="/api/checkout?plan=pro"
                  className="block w-full py-3 px-4 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors text-center"
                >
                  Subscribe to Pro
                </a>
              )
            ) : (
              <SignUpButton mode="modal">
                <button className="w-full py-3 px-4 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors">
                  Get Started with Pro
                </button>
              </SignUpButton>
            )}
          </div>
        </div>

        {/* FAQ or additional info */}
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Questions?
          </h2>
          <p className="text-slate-600">
            All plans include access to the compliance calendar with deadlines from the Federal Register
            and state medical boards. You can cancel anytime from your account settings.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}
