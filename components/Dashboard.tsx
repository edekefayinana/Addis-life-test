'use client';

import { useState } from 'react';
import { StatsCards } from './dashboard/StatsCards';
import { RecentActivity } from './dashboard/RecentActivity';
import { RecentReservations } from './dashboard/RecentReservations';
import { SettingsModal } from './modals/SettingsModal';

export function Dashboard() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="p-8 space-y-8">
      {/* Stats Cards */}
      <StatsCards />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentReservations />
        </div>
        <RecentActivity />
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export { Dashboard as DashboardWithSettings };
