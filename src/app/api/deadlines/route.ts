import { NextResponse } from 'next/server';
import { fetchHealthcareDeadlines } from '@/lib/federal-register';
import { generateLicensingDeadlines } from '@/lib/state-licensing';
import { Deadline } from '@/types';

// Cache the data for 1 hour
let cachedDeadlines: Deadline[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function GET() {
  try {
    const now = Date.now();

    // Return cached data if fresh
    if (cachedDeadlines && now - cacheTimestamp < CACHE_DURATION) {
      return NextResponse.json({
        deadlines: cachedDeadlines,
        cached: true,
        lastUpdated: new Date(cacheTimestamp).toISOString(),
      });
    }

    // Fetch fresh data
    const [federalDeadlines, licensingDeadlines] = await Promise.all([
      fetchHealthcareDeadlines(),
      Promise.resolve(generateLicensingDeadlines()),
    ]);

    // Combine and sort by date
    const allDeadlines = [...federalDeadlines, ...licensingDeadlines].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Update cache
    cachedDeadlines = allDeadlines;
    cacheTimestamp = now;

    return NextResponse.json({
      deadlines: allDeadlines,
      cached: false,
      lastUpdated: new Date(cacheTimestamp).toISOString(),
    });
  } catch (error) {
    console.error('Error fetching deadlines:', error);

    // Return cached data if available, even if stale
    if (cachedDeadlines) {
      return NextResponse.json({
        deadlines: cachedDeadlines,
        cached: true,
        stale: true,
        lastUpdated: new Date(cacheTimestamp).toISOString(),
        error: 'Failed to fetch fresh data, returning cached results',
      });
    }

    return NextResponse.json(
      { error: 'Failed to fetch deadlines' },
      { status: 500 }
    );
  }
}
