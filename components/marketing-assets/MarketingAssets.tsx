'use client';

import { useState } from 'react';
import { AssetsList } from '@/components/marketing-assets/AssetsList';
import { AssetDetailPanel } from '@/components/panels/AssetDetailPanel';

export default function MarketingAssets() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mx-auto space-y-6">
        <AssetsList onSelectAsset={setSelectedAsset} />
      </div>

      {selectedAsset && (
        <div
          className="fixed inset-0 bg-black/50 flex items-stretch justify-end z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedAsset(null);
          }}
        >
          <AssetDetailPanel
            // assetId={selectedAsset}
            onClose={() => setSelectedAsset(null)}
          />
        </div>
      )}
    </div>
  );
}
