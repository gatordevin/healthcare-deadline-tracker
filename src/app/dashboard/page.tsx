'use client';

import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Deadline, DeadlineCategory } from '@/types';
import { filterDeadlines } from '@/lib/utils';
import FilterBar from '@/components/FilterBar';
import UpcomingDeadlines from '@/components/UpcomingDeadlines';
import StateLicensingPanel from '@/components/StateLicensingPanel';
import DeadlineModal from '@/components/DeadlineModal';
import { RefreshCw, Shield, Calendar, AlertCircle, Crown } from 'lucide-react';

// Dynamic import for FullCalendar to avoid SSR issues
const DeadlineCalendar = dynamic(() => import('@/components/DeadlineCalendar'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-center min-h-[500px]">
      <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  ),
});

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [filteredDeadlines, setFilteredDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<DeadlineCategory[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPassed, setShowPassed] = useState(false);

  // Modal state
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null);

  // View state
  const [view, setView] = useState<'calendar' | 'list' | 'states'>('calendar');

  // Check subscription status
  useEffect(() => {
    if (user) {
      // Check user metadata for subscription status
      const subscriptionStatus = user.publicMetadata?.subscriptionStatus as string;
      setIsPro(subscriptionStatus === 'active');
    }
  }, [user]);

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
    fetchDeadlines();
  }, [fetchDeadlines]);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Healthcare Compliance Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome back, {user?.firstName || 'User'}!
                  {isPro && (
                    <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      <Crown className="w-3 h-3" />
                      Pro
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {!isPro && (
                <a
                  href="/api/checkout"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 font-medium transition-all"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade to Pro
                </a>
              )}
              {lastUpdated && (
                <span className="text-xs text-gray-500">
                  Updated: {new Date(lastUpdated).toLocaleString()}
                </span>
              )}
              <button
                onClick={fetchDeadlines}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* View Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendar View
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            Upcoming Deadlines
          </button>
          <button
            onClick={() => setView('states')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'states'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Shield className="w-4 h-4" />
            State Licensing
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
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center justify-center min-h-[400px]">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading healthcare compliance deadlines...</p>
            <p className="text-sm text-gray-400 mt-2">Fetching from Federal Register API</p>
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

      {/* Stats Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex gap-6">
              <span>Total Deadlines: {deadlines.length}</span>
              <span>Filtered: {filteredDeadlines.length}</span>
              <span>
                Urgent: {filteredDeadlines.filter((d) => d.status === 'urgent').length}
              </span>
            </div>
            <div>
              Data sources: Federal Register API, State Medical Boards
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
