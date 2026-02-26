'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function AccountDeactivationSection() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
  });

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const togglePasswordVisibility = (field: 'current' | 'new') => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Account Deactivation
        </h1>
        <p className="text-sm text-gray-600">
          Your account will be deactivated after admin review. You will no
          longer be able to access inventory or reservations.
        </p>
      </div>

      <div className="max-w-xl space-y-6 pt-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              placeholder="example1@gmail.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.current ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.new ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <button className="rounded-full border border-gray-300 px-8 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="rounded-full bg-teal-800 px-8 py-2.5 text-sm font-medium text-white hover:bg-teal-900 transition-colors">
            Change!
          </button>
        </div>
      </div>
    </div>
  );
}
