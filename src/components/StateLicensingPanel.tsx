'use client';

import { stateLicensingData } from '@/lib/state-licensing';
import { ExternalLink, GraduationCap, Clock, FileCheck } from 'lucide-react';

export default function StateLicensingPanel() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="w-5 h-5 text-amber-600" />
        <h2 className="text-lg font-semibold text-gray-900">State Medical Licensing</h2>
      </div>

      <div className="space-y-4">
        {stateLicensingData.map((state) => (
          <div
            key={state.stateCode}
            className="border border-gray-200 rounded-lg p-4 hover:border-amber-400 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{state.state}</h3>
                <p className="text-sm text-gray-500">{state.boardName}</p>
              </div>
              <a
                href={state.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-gray-500">Renewal: </span>
                  <span className="text-gray-700">{state.renewalPeriod}</span>
                  {state.renewalMonth && (
                    <span className="text-gray-500 text-xs block">{state.renewalMonth}</span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <FileCheck className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-gray-500">CME: </span>
                  <span className="text-gray-700">{state.cmeRequirements}</span>
                </div>
              </div>

              {state.notes && (
                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded mt-2">
                  Note: {state.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
