'use client';

import L from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type LeafletMapProps = {
  position: [number, number];
};

export function LeafletMap({ position }: LeafletMapProps) {
  const isClient = typeof window !== 'undefined';

  if (!isClient) {
    return (
      <div className="rounded-2xl overflow-hidden border bg-white h-[420px]" />
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border bg-white">
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: '420px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={markerIcon} />
      </MapContainer>
    </div>
  );
}
