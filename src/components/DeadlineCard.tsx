'use client';

import { Deadline } from '@/types';
import { getCategoryLabel, getCategoryColors, formatDate, getDaysUntilLabel } from '@/lib/utils';
import { Calendar, ExternalLink, Clock, AlertTriangle, Building2 } from 'lucide-react';

interface DeadlineCardProps {
  deadline: Deadline;
  onClick?: () => void;
}

export default function DeadlineCard({ deadline, onClick }: DeadlineCardProps) {
  const colors = getCategoryColors(deadline.category);
  const daysLabel = getDaysUntilLabel(deadline.date);

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border-l-4"
      style={{ borderLeftColor: colors.border }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className="text-xs font-semibold px-2 py-1 rounded"
          style={{ backgroundColor: colors.background, color: colors.text }}
        >
          {getCategoryLabel(deadline.category)}
        </span>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            deadline.status === 'urgent'
              ? 'bg-red-100 text-red-800'
              : deadline.status === 'passed'
              ? 'bg-gray-100 text-gray-600'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {deadline.status === 'urgent' && <AlertTriangle className="inline w-3 h-3 mr-1" />}
          {daysLabel}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{deadline.title}</h3>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{deadline.description}</p>

      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDate(deadline.date)}
        </span>
        {deadline.agency && (
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            {deadline.agency}
          </span>
        )}
        {deadline.state && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {deadline.state}
          </span>
        )}
      </div>

      {deadline.sourceUrl && (
        <a
          href={deadline.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-3"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-3 h-3" />
          View Source
        </a>
      )}
    </div>
  );
}
