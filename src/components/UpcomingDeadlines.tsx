'use client';

import { Deadline } from '@/types';
import DeadlineCard from './DeadlineCard';
import { AlertTriangle, CalendarDays } from 'lucide-react';

interface UpcomingDeadlinesProps {
  deadlines: Deadline[];
  onDeadlineClick: (deadline: Deadline) => void;
}

export default function UpcomingDeadlines({ deadlines, onDeadlineClick }: UpcomingDeadlinesProps) {
  // Sort by date and filter upcoming/urgent only
  const upcomingDeadlines = deadlines
    .filter((d) => d.status !== 'passed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10);

  const urgentCount = upcomingDeadlines.filter((d) => d.status === 'urgent').length;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
        </div>
        {urgentCount > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>{urgentCount} urgent</span>
          </div>
        )}
      </div>

      {upcomingDeadlines.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No upcoming deadlines found</p>
      ) : (
        <div className="space-y-4">
          {upcomingDeadlines.map((deadline) => (
            <DeadlineCard
              key={deadline.id}
              deadline={deadline}
              onClick={() => onDeadlineClick(deadline)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
