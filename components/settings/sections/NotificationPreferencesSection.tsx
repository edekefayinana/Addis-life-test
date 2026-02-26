'use client';

import { useState } from 'react';

export function NotificationPreferencesSection() {
  type Preferences = {
    sessionTimeout: string;
    reservationUpdates: boolean;
    commissionUpdates: boolean;
    systemAnnouncements: boolean;
  };

  type ToggleableKey = Exclude<keyof Preferences, 'sessionTimeout'>;

  const [preferences, setPreferences] = useState<Preferences>({
    sessionTimeout: '1day',
    reservationUpdates: true,
    commissionUpdates: true,
    systemAnnouncements: true,
  });

  const togglePreference = (key: ToggleableKey) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Notification Preferences
        </h1>
        <p className="text-sm text-gray-600">
          Manage your notification settings and preferences
        </p>
      </div>

      <div className="space-y-8 pt-4">
        {/* Session Timeout */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Session Timeout
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Automatically log out inactive admins to protect accounts.
          </p>
          <div className="max-w-xs">
            <select
              value={preferences.sessionTimeout}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  sessionTimeout: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="30min">30 minutes</option>
              <option value="1hour">1 hour</option>
              <option value="1day">1 day (recommended)</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        {/* Toggle Preferences */}
        <div className="space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Reservation Updates
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Get notified when a reservation is created, confirmed, or
                expires.
              </p>
            </div>
            <button
              onClick={() => togglePreference('reservationUpdates')}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                preferences.reservationUpdates ? 'bg-teal-800' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  preferences.reservationUpdates
                    ? 'translate-x-7'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Commission Updates
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Get notified when commissions are approved or paid.
              </p>
            </div>
            <button
              onClick={() => togglePreference('commissionUpdates')}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                preferences.commissionUpdates ? 'bg-teal-800' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  preferences.commissionUpdates
                    ? 'translate-x-7'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                System Announcements
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Platform updates, maintenance notices, and important alerts.
              </p>
            </div>
            <button
              onClick={() => togglePreference('systemAnnouncements')}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                preferences.systemAnnouncements ? 'bg-teal-800' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  preferences.systemAnnouncements
                    ? 'translate-x-7'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
