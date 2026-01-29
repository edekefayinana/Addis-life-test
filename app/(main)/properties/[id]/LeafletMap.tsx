'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), {
  ssr: false,
});

type LeafletMapProps = {
  position: [number, number];
};

export function LeafletMap({ position }: LeafletMapProps) {
  const markerIcon = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
  }, []);

  if (!markerIcon) {
    return (
      <div className="rounded-xl sm:rounded-2xl overflow-hidden border bg-white h-[300px] sm:h-[420px]" />
    );
  }

  return (
    <div className="rounded-xl sm:rounded-2xl overflow-hidden border bg-white">
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: '300px', width: '100%' }}
        className="sm:h-[420px]"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap & CartoDB"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position} icon={markerIcon} />
      </MapContainer>
    </div>
  );
}
