'use client';

import Image from 'next/image';
import { X, Download } from 'lucide-react';

interface AssetDetailPanelProps {
  // assetId: string
  onClose: () => void;
}

export function AssetDetailPanel({ onClose }: AssetDetailPanelProps) {
  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Asset Detail</h2>
        <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Document Preview */}
        <div className="relative rounded-lg overflow-hidden bg-gray-200 h-64">
          <Image
            src="/marketing-assests.png"
            alt="Asset preview"
            fill
            sizes="384px"
            className="object-cover"
            priority
          />
        </div>

        {/* Asset Information */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Asset Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Project</span>
              <span className="text-gray-900">Sunrise Apartments</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Category</span>
              <span className="text-gray-900">Brochure File</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">File Type</span>
              <span className="text-gray-900">PDF</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">File Size</span>
              <span className="text-gray-900">4.2 MB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Updated</span>
              <span className="text-gray-900">3 days ago</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Updated</span>
              <span className="text-gray-900">3 days ago</span>
            </div>
          </div>
        </div>

        {/* Usage Note */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Usage Note
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Official sales brochure approved for agent marketing use. Use this
            material only for approved property promotion. Do not modify or
            redistribute without permission.
          </p>
        </div>
      </div>

      {/* Download Button */}
      <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white">
        <button className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 py-2 rounded-lg font-medium flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Download File
        </button>
      </div>
    </div>
  );
}
