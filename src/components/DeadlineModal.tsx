'use client';

import { Deadline } from '@/types';
import { getCategoryLabel, getCategoryColors, formatDate, getDaysUntilLabel } from '@/lib/utils';
import { X, Calendar, ExternalLink, FileText, Building2, MapPin, AlertCircle } from 'lucide-react';

interface DeadlineModalProps {
  deadline: Deadline;
  onClose: () => void;
}

export default function DeadlineModal({ deadline, onClose }: DeadlineModalProps) {
  const colors = getCategoryColors(deadline.category);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div
          className="p-4 text-white rounded-t-lg"
          style={{ backgroundColor: colors.background }}
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold opacity-90">
                {getCategoryLabel(deadline.category)}
              </span>
              <h2 className="text-xl font-bold mt-1">{deadline.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status Banner */}
          <div
            className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${
              deadline.status === 'urgent'
                ? 'bg-red-50 text-red-800 border border-red-200'
                : deadline.status === 'passed'
                ? 'bg-gray-50 text-gray-600 border border-gray-200'
                : 'bg-green-50 text-green-800 border border-green-200'
            }`}
          >
            {deadline.status === 'urgent' && <AlertCircle className="w-5 h-5" />}
            <span className="font-semibold">{getDaysUntilLabel(deadline.date)}</span>
            <span className="text-sm">until deadline</span>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <div>
                <span className="text-xs text-gray-400 block">Deadline Date</span>
                <span className="font-medium">{formatDate(deadline.date)}</span>
              </div>
            </div>

            {deadline.agency && (
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-4 h-4" />
                <div>
                  <span className="text-xs text-gray-400 block">Agency</span>
                  <span className="font-medium">{deadline.agency}</span>
                </div>
              </div>
            )}

            {deadline.state && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <div>
                  <span className="text-xs text-gray-400 block">State</span>
                  <span className="font-medium">{deadline.state}</span>
                </div>
              </div>
            )}

            {deadline.documentNumber && (
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="w-4 h-4" />
                <div>
                  <span className="text-xs text-gray-400 block">Document #</span>
                  <span className="font-medium">{deadline.documentNumber}</span>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{deadline.description}</p>
          </div>

          {/* Priority */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Priority</h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                deadline.priority === 'high'
                  ? 'bg-red-100 text-red-800'
                  : deadline.priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {deadline.priority.charAt(0).toUpperCase() + deadline.priority.slice(1)} Priority
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {deadline.sourceUrl && (
              <a
                href={deadline.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Official Document
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
