'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { useTranslations } from 'next-intl';

// Dynamically import map component to avoid SSR issues
const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => {
    return <LoadingMap />;
  },
});

function LoadingMap() {
  const t = useTranslations('contact.map');
  return (
    <div className="flex h-full w-full rounded-xl overflow-hidden border bg-white">
      <div className="flex h-full w-full items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="mx-auto mb-2 h-12 w-12 animate-pulse bg-gray-300 rounded-full" />
          <p className="text-sm">{t('loading')}</p>
        </div>
      </div>
    </div>
  );
}

export default function LocationMap() {
  return (
    <div className="w-full h-[500px] lg:h-full rounded-xl overflow-hidden border bg-white relative z-0">
      <Map />
    </div>
  );
}
