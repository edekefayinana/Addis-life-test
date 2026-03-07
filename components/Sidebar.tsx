'use client';

import { cn } from '@/lib/utils';
import {
  Building2,
  Calendar,
  Home,
  LogOut,
  MoreVertical,
  Settings,
  User,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { SettingsModal } from './modals/SettingsModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
function titleFromPath(pathname: string, userRole?: string): string {
  if (!pathname || pathname === '/') return 'Welcome Back!';

  // Check if we're on the admin dashboard
  if (
    pathname.includes('/admin') &&
    pathname.split('/').filter(Boolean).length <= 2
  ) {
    return userRole === 'ADMIN' ? 'Admin' : 'Agent';
  }

  const seg = pathname.split('/').filter(Boolean)[0] || '';
  return seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Sidebar() {
  const pathname = usePathname();
  const [showSettings, setShowSettings] = useState(false);
  const { data: session } = useSession();
  const computedTitle = titleFromPath(pathname, session?.user?.role);

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/admin' },
    { icon: Building2, label: 'Inventory', href: '/admin/inventory' },
    { icon: Calendar, label: 'Reservations', href: '/admin/reservations' },
    // { icon: Zap, label: 'Commissions', href: '/admin/commissions' },
    // {
    //   icon: Palette,
    //   label: 'Marketing Assets',
    //   href: '/admin/marketing-assets',
    // },
    // Only show User Management for ADMIN role
    ...(session?.user?.role === 'ADMIN'
      ? [{ icon: User, label: 'User Managment', href: '/admin/users' }]
      : []),
  ];

  const bottomItems = [
    {
      icon: Settings,
      label: 'Settings',
      href: '#',
      onClick: () => setShowSettings(true),
      isLogout: false,
    },
    // { icon: HelpCircle, label: 'Get Help', href: '#', isLogout: false },
    {
      icon: LogOut,
      label: 'Log Out',
      href: '#',
      onClick: () => signOut({ callbackUrl: '/login' }),
      isLogout: true,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    // Dashboard should only be active for exact match
    if (href === '/admin') return pathname === '/admin';
    // Other menu items active for exact match or subpages
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      <div className="w-66 bg-brand-dark text-sidebar-foreground flex flex-col h-screen">
        {/* Logo */}
        <div className="px-6 py-4 border-b border-white/10 ">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-white flex items-center justify-center shadow-sm">
              <Image
                src="/agent-logo.png"
                alt="Addis Life RE Logo"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <div className="text-white font-semibold text-sm">
              {computedTitle}
            </div>
          </div>
        </div>
        {/* Secondary header inline with screenshot */}
        <div className="px-6 py-3 flex items-center justify-between text-white/90">
          <span className="text-sm">Home</span>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 py-6">
          <div className="px-4">
            <div className="text-xs px-5 tracking-wider text-white/50 mb-3 font-semibold">
              Home
            </div>
            <div className="space-y-2">
              {menuItems.map((item, idx) => {
                const IconComponent = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className={cn(
                      'flex items-center px-5 gap-3 py-3 rounded-xl transition-colors',
                      active
                        ? 'bg-white text-brand-dark font-semibold'
                        : '!text-white'
                    )}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="px-4 mt-6">
            <div className="text-xs tracking-wider text-white/50 mb-3 font-semibold">
              Others
            </div>
            <div className="space-y-2">
              {bottomItems.map((item, idx) => {
                const IconComponent = item.icon;

                if (item.isLogout) {
                  return (
                    <button
                      key={idx}
                      onClick={item.onClick}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-full text-white hover:text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={idx}
                    onClick={item.onClick}
                    className="flex items-center gap-3 px-4 py-2 rounded-full transition-colors hover:bg-sidebar-accent text-white"
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Bottom User Card */}
        <div className="relative p-4">
          {/* Profile Card */}
          <div className="bg-sidebar-accent rounded-lg p-3 flex items-center gap-3">
            <div className="relative min-w-10 h-10">
              <Image
                src={session?.user?.image || '/default-profile.png'}
                alt={session?.user?.name || 'User Profile'}
                fill
                sizes="(max-width: 640px) 32px, 40px"
                className="rounded-xl object-cover"
                priority
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">
                {session?.user.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {session?.user.email}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button aria-label="Profile menu">
                  <MoreVertical className="w-4 h-4 text-white/80" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" sideOffset={10}>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    signOut({ callbackUrl: '/login' });
                  }}
                  className="text-gray-900"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {showSettings && (
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
}
