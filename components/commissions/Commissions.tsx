'use client';

import { useState } from 'react';
import { CommissionsTable } from '@/components/commissions/CommissionsTable';
import { CommissionDetailPanel } from '@/components/panels/CommissionDetailPanel';

export default function Commissions() {
  const [selectedCommission, setSelectedCommission] = useState<string | null>(
    null
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mx-auto space-y-6">
        <CommissionsTable onSelectCommission={setSelectedCommission} />
      </div>

      {selectedCommission && (
        <div
          className="fixed inset-0 bg-black/50 flex items-stretch justify-end z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCommission(null);
          }}
        >
          <CommissionDetailPanel
            commissionId={selectedCommission}
            onClose={() => setSelectedCommission(null)}
          />
        </div>
      )}
    </div>
  );
}
