'use client';

import { X, Camera, Check } from 'lucide-react';

interface UpdateProfileModalProps {
  onClose: () => void;
}

export function UpdateProfileModal({ onClose }: UpdateProfileModalProps) {
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
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-200 rounded-lg cursor-pointer">
                <User size={20} />
                <span className="text-sm text-gray-900">Update profile</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <Bell size={20} />
                <span className="text-sm text-gray-900">
                  Notification preferences
                </span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <Lock size={20} />
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
                <CreditCard size={20} />
                <span className="text-sm text-gray-900">Payment & Finance</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <LogOut size={20} />
                <span className="text-sm text-gray-900">Logout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Update Profile
            </h2>
            <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Photo */}
          <div className="flex flex-col items-center mb-8 pb-8 border-b">
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center relative">
              <div className="w-16 h-16 bg-white rounded-full" />
              <button className="absolute bottom-0 right-0 bg-teal-900 text-white p-2 rounded-full hover:bg-teal-800">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <button className="mt-4 text-teal-900 font-medium hover:underline">
              Edit photo
            </button>
          </div>

          {/* Basic Info */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Basic Info.
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Biruk Solomon"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Agent ID (read-only)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    defaultValue="Al-1927736"
                    disabled
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                  <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                    <Check className="w-4 h-4" /> Approved Agent
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Contact Info.
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="example1@gmail.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button className="px-6 py-2 bg-teal-900 text-white rounded-lg hover:bg-teal-800 font-medium">
              Done!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { User, Bell, Lock, CreditCard, LogOut } from 'lucide-react';
