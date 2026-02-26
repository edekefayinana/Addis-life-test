'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

interface NotificationPreferencesModalProps {
  onClose: () => void;
}

export function NotificationPreferencesModal({
  onClose,
}: NotificationPreferencesModalProps) {
  const [notifications, setNotifications] = useState({
    reservations: true,
    commissions: true,
    announcements: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-200 rounded-lg cursor-pointer">
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
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
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
              Notifications
            </h2>
            <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Session Timeout
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Automatically log out inactive admins to protect accounts.
              </p>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>1 day (recommended)</option>
                <option>2 days</option>
                <option>7 days</option>
              </select>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Notification Preferences
              </h3>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Reservation Updates
                    </p>
                    <p className="text-sm text-gray-600">
                      Get notified when a reservation is created, confirmed, or
                      expires.
                    </p>
                  </div>
                  <button
                    onClick={() => toggleNotification('reservations')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      notifications.reservations ? 'bg-teal-900' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notifications.reservations
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Commission Updates
                    </p>
                    <p className="text-sm text-gray-600">
                      Get notified when commissions are approved or paid.
                    </p>
                  </div>
                  <button
                    onClick={() => toggleNotification('commissions')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      notifications.commissions ? 'bg-teal-900' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notifications.commissions
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      System Announcements
                    </p>
                    <p className="text-sm text-gray-600">
                      Platform updates, maintenance notices, and important
                      alerts.
                    </p>
                  </div>
                  <button
                    onClick={() => toggleNotification('announcements')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      notifications.announcements
                        ? 'bg-teal-900'
                        : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notifications.announcements
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
