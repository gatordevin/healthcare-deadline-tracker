'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { Shield, Calendar, Bell, FileText, CheckCircle, Clock, Database, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Calendar,
    title: 'Compliance Calendar',
    description: 'Visual calendar showing all upcoming regulatory deadlines. Never miss a filing date or renewal window.',
  },
  {
    icon: FileText,
    title: 'Federal Register Updates',
    description: 'Automated tracking of HIPAA rules, CMS regulations, and federal healthcare compliance requirements.',
  },
  {
    icon: Shield,
    title: 'State Licensing Dates',
    description: 'Track medical license renewals across multiple states. Currently supporting FL, CA, SC, MD, and NJ.',
  },
  {
    icon: Bell,
    title: 'Smart Filtering',
    description: 'Filter deadlines by state, category, or urgency. Focus on what matters to your practice.',
  },
];

const dataSources = [
  {
    name: 'Federal Register API',
    description: 'Official source for HIPAA rules, proposed regulations, and compliance deadlines',
    url: 'https://www.federalregister.gov',
  },
  {
    name: 'State Medical Boards',
    description: 'Licensing renewal periods and CME requirements (FL, CA, SC, MD, NJ)',
    url: null,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Shield className="w-10 h-10 text-blue-600" />
              <span className="text-xl font-semibold text-slate-800">Healthcare Compliance Tracker</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6">
              Never Miss a Compliance Deadline
            </h1>

            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Track HIPAA regulations, CMS deadlines, and state licensing renewals in one place.
              Built for healthcare practices that need to stay compliant.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpButton mode="modal">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg transition-colors flex items-center justify-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="px-8 py-4 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-lg transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                The Problem
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Healthcare compliance deadlines are scattered across federal agencies, state boards,
                and multiple regulatory bodies. Missing a deadline can result in penalties,
                license issues, or non-compliance status.
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span>HIPAA rule changes announced with limited notice</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span>State licensing renewal dates vary by state</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span>CMS reporting periods with strict deadlines</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                The Solution
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We aggregate publicly available regulatory data into a single compliance calendar.
                See all your deadlines at a glance, filter by relevance, and stay ahead of requirements.
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>All federal healthcare deadlines in one view</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>State-specific licensing information</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Filter and prioritize what matters to you</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              What You Get
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Clear, organized access to healthcare regulatory deadlines
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-blue-50 mb-5">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-200 mb-4">
              <Database className="w-6 h-6 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Data Sources
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              We aggregate publicly available regulatory data. Transparency about our sources.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {dataSources.map((source) => (
              <div key={source.name} className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">{source.name}</h3>
                <p className="text-sm text-slate-600 mb-3">{source.description}</p>
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Visit source
                  </a>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            Data is refreshed regularly. Always verify critical deadlines with official sources.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20" id="pricing">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Simple Pricing
            </h2>
            <p className="text-lg text-slate-600">
              Choose the plan that fits your practice
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
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
              <SignUpButton mode="modal">
                <button className="w-full py-3 px-4 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                  Get Started
                </button>
              </SignUpButton>
            </div>

            {/* Pro Plan */}
            <div className="bg-slate-900 rounded-xl p-8 text-white relative">
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
              <SignUpButton mode="modal">
                <button className="w-full py-3 px-4 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors">
                  Get Started with Pro
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Compliant. Stay Focused.
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Let us track the deadlines so you can focus on patient care.
          </p>
          <SignUpButton mode="modal">
            <button className="px-8 py-4 bg-white text-slate-900 rounded-lg hover:bg-slate-100 font-medium text-lg transition-colors">
              Start Your Free Trial
            </button>
          </SignUpButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-slate-600">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Healthcare Compliance Tracker</span>
            </div>
            <div className="text-sm text-slate-500">
              Data sources: Federal Register API, State Medical Boards
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
