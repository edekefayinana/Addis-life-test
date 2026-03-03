'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Bell } from 'lucide-react';
import { NotificationsModal } from './modals/NotificationsModal';
import { useEffect } from 'react';
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { getApps, initializeApp } from 'firebase/app';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

function titleFromPath(pathname: string): string {
  if (!pathname || pathname === '/') return 'Welcome Back!';
  const seg = pathname.split('/').filter(Boolean)[0] || '';
  return seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function TopBar({ title }: { title?: string }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const pathname = usePathname();
  const computedTitle = title ?? titleFromPath(pathname);
  const { data: session } = useSession();

  // Firebase config (should match NotificationsModal)
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Initialize Firebase app only once
  if (typeof window !== 'undefined' && getApps().length === 0) {
    initializeApp(firebaseConfig);
  }

  // Listen for unread notifications for the current user
  useEffect(() => {
    if (typeof window === 'undefined' || !session?.user?.id) return;
    const db = getFirestore();
    // Assume notifications have an 'isRead' field (default false)
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', session.user.id),
      where('isRead', '==', false)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHasUnread(snapshot.size > 0);
    });
    return () => unsubscribe();
  }, [session?.user?.id]);

  return (
    <div className="px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          {computedTitle}
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowNotifications(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            {hasUnread && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 border-2 border-white rounded-full shadow-lg animate-pulse" />
            )}
          </button>
          <button
            className="relative w-8 h-8 sm:w-10 sm:h-10"
            aria-label="Open profile"
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
        <NotificationsModal onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
}
