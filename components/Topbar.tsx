'use client';

import { useNotifications } from '@/lib/hooks/useNotificationsNew';
import { ArrowLeftCircle, Bell } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { NotificationsModalNew } from './modals/NotificationsModalNew';
import { SettingsModal } from './modals/SettingsModal';

export function TopBar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { data: session } = useSession();

  // Use the new notification hook to get unread count
  const { stats } = useNotifications({
    autoRefresh: true,
    refreshInterval: 5000, // Refresh every 5 seconds for more responsive updates
  });

  const hasUnread = (stats?.unread || 0) > 0;
  const unreadCount = stats?.unread || 0;

  return (
    <div className="px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1 px-3 py-2 rounded-lg  text-sm font-medium"
            title="Back to public page"
          >
            <ArrowLeftCircle className="w-5 h-5" />
            <span>Home</span>
          </Link>
          {/* <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          {computedTitle}
        </h1> */}
        </div>
        <div className="flex items-center gap-4">
          {/* Back to Public Page button */}

          <button
            onClick={() => setShowNotifications(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            {hasUnread && (
              <>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 border-2 border-white rounded-full shadow-lg animate-pulse" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-600 text-white text-xs font-medium rounded-full flex items-center justify-center px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </>
            )}
          </button>
          <button
            className="relative w-8 h-8 sm:w-10 sm:h-10"
            aria-label="Open profile"
            onClick={() => setShowSettings(true)}
          >
            <Image
              src={session?.user?.image || '/default-profile.png'}
              alt={session?.user?.name || 'User Profile'}
              fill
              sizes="(max-width: 640px) 32px, 40px"
              className="rounded-2xl object-cover"
              priority
            />
            <span
              aria-hidden
              className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 flex items-center justify-center"
              style={{ width: '16.67px', height: '16.67px' }}
            >
              {/* White outline (slightly larger lobes) + Green verified badge with check */}
              <svg viewBox="0 0 24 24" width="16.67" height="16.67" aria-hidden>
                <g>
                  {/* Outer white border by drawing bigger overlapping circles */}
                  <g fill="#ffffff">
                    <circle cx="12" cy="5.8" r="6.2" opacity="0" />
                    {/* 8 lobes (white border) */}
                    <circle cx="12" cy="6" r="6.2" />
                    <circle cx="12" cy="18" r="6.2" />
                    <circle cx="6" cy="12" r="6.2" />
                    <circle cx="18" cy="12" r="6.2" />
                    <circle cx="7.757" cy="7.757" r="6.2" />
                    <circle cx="16.243" cy="7.757" r="6.2" />
                    <circle cx="7.757" cy="16.243" r="6.2" />
                    <circle cx="16.243" cy="16.243" r="6.2" />
                  </g>
                  {/* Inner green shape */}
                  <g fill="#22C55E">
                    <circle cx="12" cy="6" r="5.6" />
                    <circle cx="12" cy="18" r="5.6" />
                    <circle cx="6" cy="12" r="5.6" />
                    <circle cx="18" cy="12" r="5.6" />
                    <circle cx="7.757" cy="7.757" r="5.6" />
                    <circle cx="16.243" cy="7.757" r="5.6" />
                    <circle cx="7.757" cy="16.243" r="5.6" />
                    <circle cx="16.243" cy="16.243" r="5.6" />
                  </g>
                  {/* Check mark */}
                  <path
                    d="M8.2 12.6l2.3 2.3 5-5"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </span>
          </button>
        </div>
      </div>
      {showNotifications && (
        <NotificationsModalNew onClose={() => setShowNotifications(false)} />
      )}

      {showSettings && (
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
