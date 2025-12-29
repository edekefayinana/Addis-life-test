'use client';

import { useRef } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploadProps {
  label: string;
  required?: boolean;
}

export default function FileUpload({ label, required }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-2">
      <label className="text-base font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer mt-2 rounded-xl border border-gray-700 bg-gray-50 p-8 text-center transition hover:border-gray-800"
      >
        <div className="flex items-center justify-center">
          {/* Outer soft circle */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            {/* Inner circle */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
              <UploadCloud className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <p className="mt-2 text-sm font-medium text-gray-700">
          Click to upload{' '}
          <span className="text-gray-500">or drag and drop</span>
        </p>

        <p className="mt-1 text-xs text-gray-500">PDF, JPG, or PNG (max 5MB)</p>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </div>
    </div>
  );
}
