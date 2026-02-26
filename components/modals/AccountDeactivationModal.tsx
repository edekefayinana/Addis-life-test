'use client';

import { X } from 'lucide-react';

interface AccountDeactivationModalProps {
  onClose: () => void;
}

export function AccountDeactivationModal({
  onClose,
}: AccountDeactivationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 p-6 border-r min-h-full">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Settings</h3>

          <div className="mb-6">
            <div className="text-xs uppercase tracking-wider font-semibold text-gray-600 mb-3">
              Accounts Settings
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <span className="w-5 h-5">👤</span>
                <span className="text-sm text-gray-900">Update profile</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <span className="w-5 h-5">🔔</span>
                <span className="text-sm text-gray-900">
                  Notification preferences
                </span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <span className="w-5 h-5">🔑</span>
                <span className="text-sm text-gray-900">Password Update</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-gray-600 mb-3">
              Other
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <span className="w-5 h-5">💳</span>
                <span className="text-sm text-gray-900">Payment & Finance</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-200 rounded-lg cursor-pointer">
                <span className="w-5 h-5">🚪</span>
                <span className="text-sm text-gray-900">
                  Account Deactivation
                </span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <span className="w-5 h-5">🔓</span>
                <span className="text-sm text-gray-900">Logout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Account Deactivation
            </h2>
            <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-700 mb-8">
            Your account will be deactivated after admin review. You will no
            longer be able to access inventory or reservations.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  defaultValue="example1@gmail.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button className="absolute right-3 top-3 text-gray-400">
                  👁
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  defaultValue="····•3!"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button className="absolute right-3 top-3 text-gray-400">
                  👁
                </button>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button className="px-6 py-2 bg-teal-900 text-white rounded-lg hover:bg-teal-800 font-medium">
              Change
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
