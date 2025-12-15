'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import map component to avoid SSR issues
const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="flex w-full h-full bg-[#F6F8FA] p-8 shadow-none rounded-3xl">
      <div className="flex h-full w-full items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="mx-auto mb-2 h-12 w-12 animate-pulse bg-gray-300 rounded-full" />
          <p className="text-sm">Loading map...</p>
        </div>
      </div>
    </div>
  ),
});

export default function LocationMap() {
  return (
    <div className="w-full h-[500px] lg:h-full bg-[#F6F8FA] shadow-none rounded-3xl">
      <Map />
    </div>
  );
}
