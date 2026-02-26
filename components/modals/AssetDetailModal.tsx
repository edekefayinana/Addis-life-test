'use client';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AssetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AssetDetailModal({
  isOpen,
  onClose,
}: AssetDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Asset Detail</h2>
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Preview */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6 flex flex-col items-center justify-center min-h-40">
          <div className="bg-red-500 text-white rounded-lg p-3 mb-4">
            <div className="text-2xl font-bold">PDF</div>
          </div>
          <div className="h-6 bg-gray-300 rounded w-32 mb-2" />
          <div className="h-6 bg-gray-300 rounded w-40 mb-2" />
          <div className="h-6 bg-gray-300 rounded w-36" />
        </div>

        {/* Asset Name */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900">
            Sunrise Apartments – Media Kit
          </h3>
          <p className="text-sm text-gray-600">4.2 MB</p>
        </div>

        {/* Asset Information */}
        <div className="mb-6 pb-6 border-b">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Asset Information
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Project</span>
              <span className="text-gray-900 font-medium">
                Sunrise Apartments
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Category</span>
              <span className="text-gray-900 font-medium">Brochure File</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">File Type</span>
              <span className="text-gray-900 font-medium">PDF</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">File Size</span>
              <span className="text-gray-900 font-medium">4.2 MB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Updated</span>
              <span className="text-gray-900 font-medium">3 days ago</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Updated</span>
              <span className="text-gray-900 font-medium">3 days ago</span>
            </div>
          </div>
        </div>

        {/* Usage Note */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Usage Note
          </h4>
          <p className="text-sm text-gray-600">
            Official sales brochure approved for agent marketing use.Use this
            material only for approved property promotion. Do not modify or
            redistribute without permission.
          </p>
        </div>

        {/* Download Button */}
        <Button className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Download File
        </Button>
      </div>
    </div>
  );
}
