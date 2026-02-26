'use client';

import { X, Download } from 'lucide-react';

interface CommissionDetailPanelProps {
  // commissionId: string
  onClose: () => void;
}

export function CommissionDetailPanel({ onClose }: CommissionDetailPanelProps) {
  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">
          Commission Detail
        </h2>
        <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Summary about reservation
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Client Name</span>
              <span className="text-gray-900">Ahmed Elias Ali</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Unit</span>
              <span className="text-gray-900 font-medium">A-304</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Project</span>
              <span className="text-gray-900">Sunrise Apartments</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bedroom</span>
              <span className="text-gray-900">3 Bedroom Apartment</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Floor Number</span>
              <span className="text-gray-900">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Reservation Status</span>
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <span className="w-2 h-2 bg-green-600 rounded-full" />
                Approved
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Reservation Date</span>
              <span className="text-gray-900">12 Mar 2025</span>
            </div>
          </div>
        </div>

        {/* Commission Summary */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Commission Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Unit&apos;s Deal value</span>
              <span className="text-gray-900 font-medium">ETB 3,300,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Commission Rate</span>
              <span className="text-gray-900">3%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Commission Amount</span>
              <span className="text-gray-900 font-medium">ETB 125,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Status</span>
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <span className="w-2 h-2 bg-green-600 rounded-full" />
                Paid
              </span>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Activity Timeline
          </h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-3 h-3 bg-teal-900 rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Commission Paid
                </p>
                <p className="text-xs text-gray-600">
                  Commission for this unit was paid.
                </p>
                <p className="text-xs text-gray-500 mt-1">Now</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-3 h-3 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Commission Approved
                </p>
                <p className="text-xs text-gray-600">
                  Commission for this Unit has been approved.
                </p>
                <p className="text-xs text-gray-500 mt-1">Today</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-3 h-3 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Commission Pending
                </p>
                <p className="text-xs text-gray-600">
                  Commission awaiting deal confirmation.
                </p>
                <p className="text-xs text-gray-500 mt-1">Mar 18</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white">
        <button className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 py-2 rounded-lg font-medium flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Download Receipt
        </button>
      </div>
    </div>
  );
}
