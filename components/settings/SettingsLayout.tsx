'use client';

import { Lock, LogOut, User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { AccountDeactivationSection } from './sections/AccountDeactivationSection';
import { ChangePasswordSection } from './sections/ChangePasswordSection';
import { NotificationPreferencesSection } from './sections/NotificationPreferencesSection';
import { PaymentFinanceSection } from './sections/PaymentFinanceSection';
import { UpdateProfileSection } from './sections/UpdateProfileSection';

type ActiveSection =
  | 'profile'
  | 'notifications'
  | 'password'
  | 'payment'
  | 'deactivation'
  | null;

interface SettingsLayoutProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

export function SettingsLayout({
  activeSection,
  onSectionChange,
}: SettingsLayoutProps) {
  const sectionTitles: Record<Exclude<ActiveSection, null>, string> = {
    profile: 'Update Profile',
    notifications: 'Notifications',
    password: 'Change Password',
    payment: 'Payment & Finance',
    deactivation: 'Account Deactivation',
  };

  const menuItems = [
    {
      section: 'Account Settings',
      items: [
        { id: 'profile', label: 'Update profile', icon: User },
        // { id: 'notifications', label: 'Notification preferences', icon: Bell },
        { id: 'password', label: 'Password Update', icon: Lock },
      ],
    },
    {
      section: 'Other',
      items: [
        // { id: 'payment', label: 'Payment & Finance', icon: CreditCard },
        // {
        //   id: 'deactivation',
        //   label: 'Account Deactivation',
        //   icon: AlertCircle,
        // },
        { id: 'logout', label: 'Logout', icon: LogOut },
      ],
    },
  ];

  const activeTitle = activeSection
    ? sectionTitles[activeSection]
    : sectionTitles.profile;

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <UpdateProfileSection />;
      case 'notifications':
        return <NotificationPreferencesSection />;
      case 'password':
        return <ChangePasswordSection />;
      case 'payment':
        return <PaymentFinanceSection />;
      case 'deactivation':
        return <AccountDeactivationSection />;
      default:
        return <UpdateProfileSection />;
    }
  };

  return (
    <div className="flex h-full flex-col w-full">
      {/* Top header with section title */}
      <div className="flex items-center border-b border-gray-200 px-8 py-6">
        <h1 className="text-base font-semibold text-gray-900 w-72">Settings</h1>

        <p className="text-base font-semibold text-gray-900 text-start">
          {activeTitle}
        </p>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar - Settings Menu */}
        <div className="w-[276px] bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {menuItems.map((group) => (
              <div key={group.section}>
                <h2 className="text-[11px] font-semibold text-gray-400 mb-3">
                  {group.section}
                </h2>
                <div className="space-y-2">
                  {group.items.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeSection === item.id;
                    const isLogout = item.id === 'logout';

                    if (isLogout) {
                      return (
                        <button
                          key={item.id}
                          onClick={() => signOut({ callbackUrl: '/login' })}
                          className="w-full flex items-center gap-2 pl-0 pr-4 py-2.5 rounded-sm text-[13px] text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <span className="h-8 w-1 rounded-l-full bg-transparent" />
                          <IconComponent className="w-4 h-4" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    }

                    return (
                      <button
                        key={item.id}
                        onClick={() =>
                          onSectionChange(item.id as ActiveSection)
                        }
                        className={`w-full flex items-center gap-2 pl-0 pr-4 py-2.5 rounded-sm text-[13px] transition-colors text-left ${
                          isActive
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span
                          className={`h-8 w-1 rounded-l-full ${
                            isActive ? 'bg-[#F4A905]' : 'bg-transparent'
                          }`}
                        />
                        <IconComponent
                          className={`w-4 h-4 ${isActive ? 'text-gray-900' : 'text-gray-500'}`}
                        />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">{renderSection()}</div>
        </div>
      </div>
    </div>
  );
}
