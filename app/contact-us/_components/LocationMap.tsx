import { MapPin } from 'lucide-react';
import React from 'react';

export default function LocationMap() {
  return (
    <div className="flex w-full h-full  bg-[#F6F8FA] p-8 shadow-none rounded-3xl ">
      <div className="flex h-full w-full items-center justify-center text-gray-400">
        <div className="text-center">
          <MapPin className="mx-auto mb-2 h-12 w-12" />
          <p className="text-sm">Map will be integrated here</p>
        </div>
      </div>
    </div>
  );
}
