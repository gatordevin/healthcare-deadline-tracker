'use client';

import { Shield, Calendar, CheckCircle, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function UpgradePrompt() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-slate-800">Healthcare Compliance Tracker</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-6">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Subscribe to Access Your Dashboard
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Get access to the compliance calendar, deadline tracking, and state licensing information.
          </p>
        </div>

        {/* Preview of what they get */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            What&apos;s Included
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-slate-900">Compliance Calendar</h3>
                <p className="text-sm text-slate-600">Visual calendar with all regulatory deadlines</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-slate-900">Federal Register Updates</h3>
                <p className="text-sm text-slate-600">HIPAA rules and federal healthcare compliance</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-slate-900">State Licensing Dates</h3>
                <p className="text-sm text-slate-600">Track renewals across FL, CA, SC, MD, NJ</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-slate-900">Smart Filtering</h3>
                <p className="text-sm text-slate-600">Filter by state, category, or urgency</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Basic</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold text-slate-900">$19</span>
              <span className="text-slate-600">/month</span>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Full calendar access and deadline tracking
            </p>
            <a
              href="/api/checkout?plan=basic"
              className="block w-full py-3 px-4 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors text-center"
            >
              Subscribe to Basic
            </a>
          </div>

          {/* Pro */}
          <div className="bg-slate-900 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold">Pro</h3>
              <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                Recommended
              </span>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold">$39</span>
              <span className="text-slate-400">/month</span>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Everything in Basic + email reminders & priority support
            </p>
            <a
              href="/api/checkout?plan=pro"
              className="block w-full py-3 px-4 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors text-center"
            >
              Subscribe to Pro
            </a>
          </div>
        </div>

        {/* View full pricing */}
        <div className="text-center mt-8">
          <Link
            href="/pricing"
            className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
          >
            View full pricing details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
