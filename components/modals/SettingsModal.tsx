'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { SettingsLayout } from '../settings/SettingsLayout';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ActiveSection =
  | 'profile'
  | 'notifications'
  | 'password'
  | 'payment'
  | 'deactivation'
  | null;

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState<ActiveSection>('profile');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[756px] h-[740px] max-h-[calc(100vh-80px)] bg-white shadow-2xl rounded-3xl overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          aria-label="Close settings"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Settings content (sidebar + sections) */}
        <SettingsLayout
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
