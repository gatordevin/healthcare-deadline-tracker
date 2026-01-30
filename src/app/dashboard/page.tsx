'use client';

import { useUser, UserButton } from "@clerk/nextjs";
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Deadline, DeadlineCategory } from '@/types';
import { filterDeadlines } from '@/lib/utils';
import FilterBar from '@/components/FilterBar';
import UpcomingDeadlines from '@/components/UpcomingDeadlines';
import StateLicensingPanel from '@/components/StateLicensingPanel';
import DeadlineModal from '@/components/DeadlineModal';
import UpgradePrompt from '@/components/UpgradePrompt';
import { RefreshCw, Shield, Calendar, AlertCircle, List, MapPin, Settings, CheckCircle } from 'lucide-react';

// Dynamic import for FullCalendar to avoid SSR issues
const DeadlineCalendar = dynamic(() => import('@/components/DeadlineCalendar'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg border border-slate-200 p-8 flex items-center justify-center min-h-[500px]">
      <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  ),
});

function DashboardContent() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');

  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [filteredDeadlines, setFilteredDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<DeadlineCategory[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPassed, setShowPassed] = useState(false);

  // Modal state
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null);

  // View state
  const [view, setView] = useState<'calendar' | 'list' | 'states'>('calendar');

  // Subscription status
  const subscriptionStatus = user?.publicMetadata?.subscriptionStatus as string | undefined;
  const subscriptionPlan = user?.publicMetadata?.subscriptionPlan as string | undefined;
  const hasActiveSubscription = subscriptionStatus === 'active';
  const isPro = hasActiveSubscription && subscriptionPlan === 'pro';

  const fetchDeadlines = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/deadlines');
      const data = await response.json();

      if (data.error && !data.deadlines) {
        throw new Error(data.error);
      }

      setDeadlines(data.deadlines || []);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch deadlines');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasActiveSubscription) {
      fetchDeadlines();
    }
  }, [fetchDeadlines, hasActiveSubscription]);

  // Apply filters
  useEffect(() => {
    const filtered = filterDeadlines(deadlines, {
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      states: selectedStates.length > 0 ? selectedStates : undefined,
      status: showPassed ? undefined : ['upcoming', 'urgent'],
      search: searchQuery || undefined,
    });

    setFilteredDeadlines(filtered);
  }, [deadlines, selectedCategories, selectedStates, searchQuery, showPassed]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Show upgrade prompt if no active subscription
  if (!hasActiveSubscription) {
    return <UpgradePrompt />;
  }

  // Calculate stats
  const urgentCount = filteredDeadlines.filter((d) => d.status === 'urgent').length;
  const upcomingCount = filteredDeadlines.filter((d) => d.status === 'upcoming').length;
  const thisMonthDeadlines = filteredDeadlines.filter((d) => {
    const deadline = new Date(d.date);
    const now = new Date();
    return deadline.getMonth() === now.getMonth() && deadline.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Success Toast */}
      {success && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <span>Subscription activated successfully!</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-7 h-7 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  Compliance Dashboard
                </h1>
                <p className="text-xs text-slate-500">
                  {user?.firstName ? `Welcome, ${user.firstName}` : 'Welcome'}
                  {isPro && (
                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      Pro
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="hidden sm:inline text-xs text-slate-400">
                  Updated {new Date(lastUpdated).toLocaleDateString()}
                </span>
              )}
              <button
                onClick={fetchDeadlines}
                disabled={loading}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <a
                href="/api/create-portal-session"
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Manage subscription"
              >
                <Settings className="w-5 h-5" />
              </a>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-slate-600">
                <span className="font-semibold text-slate-900">{urgentCount}</span> Urgent
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-slate-600">
                <span className="font-semibold text-slate-900">{upcomingCount}</span> Upcoming
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-slate-600">
                <span className="font-semibold text-slate-900">{thisMonthDeadlines}</span> This Month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              view === 'calendar'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              view === 'list'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4" />
            List
          </button>
          <button
            onClick={() => setView('states')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              view === 'states'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            States
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {view !== 'states' && (
          <FilterBar
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            selectedStates={selectedStates}
            onStateChange={setSelectedStates}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showPassed={showPassed}
            onShowPassedChange={setShowPassed}
          />
        )}

        {loading && deadlines.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 flex flex-col items-center justify-center min-h-[400px]">
            <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600">Loading compliance deadlines...</p>
            <p className="text-sm text-slate-400 mt-1">Fetching from Federal Register</p>
          </div>
        ) : (
          <>
            {view === 'calendar' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <DeadlineCalendar
                    deadlines={filteredDeadlines}
                    onEventClick={setSelectedDeadline}
                  />
                </div>
                <div>
                  <UpcomingDeadlines
                    deadlines={filteredDeadlines}
                    onDeadlineClick={setSelectedDeadline}
                  />
                </div>
              </div>
            )}

            {view === 'list' && (
              <UpcomingDeadlines
                deadlines={filteredDeadlines}
                onDeadlineClick={setSelectedDeadline}
              />
            )}

            {view === 'states' && <StateLicensingPanel />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <div>
              Data: Federal Register API, State Medical Boards
            </div>
            <div>
              {filteredDeadlines.length} deadline{filteredDeadlines.length !== 1 ? 's' : ''} shown
            </div>
          </div>
        </div>
      </footer>

      {/* Deadline Modal */}
      {selectedDeadline && (
        <DeadlineModal
          deadline={selectedDeadline}
          onClose={() => setSelectedDeadline(null)}
        />
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
