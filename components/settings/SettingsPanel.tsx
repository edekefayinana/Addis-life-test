'use client';

import {
  User,
  Bell,
  Lock,
  LogOut,
  AlertCircle,
  CreditCard,
} from 'lucide-react';

interface SettingsPanelProps {
  onOpenModal: (
    modal: 'profile' | 'password' | 'notifications' | 'deactivation'
  ) => void;
}

export function SettingsPanel({ onOpenModal }: SettingsPanelProps) {
  const menuItems = [
    {
      section: 'Accounts Settings',
      items: [
        {
          label: 'Update profile',
          icon: User,
          onClick: () => onOpenModal('profile'),
        },
        {
          label: 'Notification preferences',
          icon: Bell,
          onClick: () => onOpenModal('notifications'),
        },
        {
          label: 'Password Update',
          icon: Lock,
          onClick: () => onOpenModal('password'),
        },
      ],
    },
    {
      section: 'Other',
      items: [
        {
          label: 'Payment & Finance',
          icon: CreditCard,
          onClick: () => {},
        },
        {
          label: 'Account Deactivation',
          icon: AlertCircle,
          onClick: () => onOpenModal('deactivation'),
        },
        {
          label: 'Logout',
          icon: LogOut,
          onClick: () => {},
        },
      ],
    },
  ];

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600 mb-8">
          Manage your account preferences and security settings
        </p>

        <div className="space-y-8">
          {menuItems.map((group) => (
            <div key={group.section}>
              <h2 className="text-sm font-semibold text-gray-600 mb-4 uppercase">
                {group.section}
              </h2>
              <div className="space-y-2">
                {group.items.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                    >
                      <IconComponent className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-900 font-medium">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
