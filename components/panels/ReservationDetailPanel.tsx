/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { X, Copy } from 'lucide-react';

interface ReservationDetailPanelProps {
  reservation: any;
  onClose: () => void;
}

export function ReservationDetailPanel({
  reservation,
  onClose,
}: ReservationDetailPanelProps) {
  // Remove debug logs
  // Helper to shorten unit title
  const shortUnitTitle = reservation?.unit?.split('–')[0]?.trim() + '...';
  // Helper to format price
  const dealValue = reservation?.property?.areaSizeM2
    ? (reservation?.property?.areaSizeM2 * 310_800).toFixed(2)
    : '-';
  const commission = reservation?.property?.areaSizeM2
    ? (reservation?.property?.areaSizeM2 * 310_800 * 0.0077).toFixed(2)
    : '-';
  return (
    <div className="w-96 h-screen bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">
          Reservation Detail
        </h2>
        <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Unit</span>
              <span className="text-gray-900 font-medium underline">
                {shortUnitTitle}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Project</span>
              <span className="text-gray-900">{reservation?.project}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Bedroom</span>
              <span className="text-gray-900">{reservation?.bedrooms}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Floor Number</span>
              <span className="text-gray-900">
                {reservation?.property?.availableFloors?.join(', ') || '-'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span className="flex items-center gap-2 text-gray-900 font-medium">
                <span
                  className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${reservation?.status === 'CONFIRMED' ? 'bg-green-500' : 'bg-yellow-500'} text-white`}
                >
                  <svg viewBox="0 0 24 24" width="10" height="10" aria-hidden>
                    <path
                      d="M6 12l3 3 9-9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {reservation?.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Reservation Date</span>
              <span className="text-gray-900">{reservation?.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Unit&apos;s Deal value</span>
              <span className="text-gray-900 font-medium">
                {reservation?.property?.areaSizeM2 ? `ETB ${dealValue}` : '-'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Expected Commission</span>
              <span className="text-gray-900 font-medium">
                {reservation?.property?.areaSizeM2 ? `ETB ${commission}` : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Client Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Client Name</span>
              <span className="text-gray-900 font-medium">
                {reservation?.user?.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Phone</span>
              <span className="text-gray-900 inline-flex items-center gap-2 font-medium">
                {reservation?.user?.phone}
                <button
                  type="button"
                  aria-label="Copy phone"
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() =>
                    navigator.clipboard?.writeText(
                      reservation?.user?.phone || ''
                    )
                  }
                >
                  <Copy className="w-4 h-4" />
                </button>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email</span>
              <span className="text-gray-900 inline-flex items-center gap-2 font-medium">
                {reservation?.user?.email}
                <button
                  type="button"
                  aria-label="Copy email"
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() =>
                    navigator.clipboard?.writeText(
                      reservation?.user?.email || ''
                    )
                  }
                >
                  <Copy className="w-4 h-4" />
                </button>
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-shrink-0 mt-1.5">
                <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center ring-1 ring-white">
                  <div className="w-2.5 h-2.5 bg-teal-900 rounded-full" />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Reservation Created
                </p>
                <p className="text-xs text-gray-600">
                  You reserved this Unit for client {reservation?.user?.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(reservation?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {reservation?.status === 'CONFIRMED' && (
              <div className="flex gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Reservation Confirmed
                  </p>
                  <p className="text-xs text-gray-600">
                    Reservation for this Unit has been confirmed
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {reservation?.confirmedAt
                      ? new Date(reservation?.confirmedAt).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
              </div>
            )}
            {reservation?.status === 'CANCELLED' && (
              <div className="flex gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Reservation Cancelled
                  </p>
                  <p className="text-xs text-gray-600">
                    Reservation for this Unit has been cancelled
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {reservation?.cancelledAt
                      ? new Date(reservation?.cancelledAt).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white">
        <button
          onClick={onClose}
          className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 py-2 rounded-full font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}
