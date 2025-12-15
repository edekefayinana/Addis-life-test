'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    // Delay to ensure container is fully rendered
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}
