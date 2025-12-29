'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import L from 'leaflet';
import type { Listing } from '@/data/featuredProperties';
import type { PropertyCardProps } from '@/components/PropertyCard';
import { Bath, Bed, Maximize } from 'lucide-react';

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
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), {
  ssr: false,
});
const MapResizeHandler = dynamic(
  () =>
    import('./MapResizeHandler').then((m) => ({ default: m.MapResizeHandler })),
  { ssr: false }
);

type PropertiesMapProps = {
  properties: Listing[];
};

// Helper function to get approximate coordinates based on location
// In a real app, you'd want to geocode these addresses
function getCoordinatesForLocation(location: string): [number, number] {
  // Default center for Addis Ababa
  const defaultCoords: [number, number] = [9.0108, 38.7546];

  // Simple location-based coordinate mapping
  const locationMap: Record<string, [number, number]> = {
    sarbet: [9.005, 38.75],
    bole: [8.98, 38.78],
    summit: [9.03, 38.73],
    kazanchis: [9.02, 38.76],
    cmc: [9.04, 38.77],
    lideta: [9.01, 38.74],
    gullele: [9.05, 38.79],
    megenagna: [9.06, 38.76],
    'old airport': [8.99, 38.79],
    ayat: [9.08, 38.8],
    bishoftu: [8.75, 38.98],
  };

  const locationLower = location.toLowerCase();
  for (const [key, coords] of Object.entries(locationMap)) {
    if (locationLower.includes(key)) {
      // Add small random offset to avoid overlapping markers
      const offset = (Math.random() - 0.5) * 0.01;
      return [coords[0] + offset, coords[1] + offset];
    }
  }

  return defaultCoords;
}

export function PropertiesMap({ properties }: PropertiesMapProps) {
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

  // Calculate center based on all properties
  const center: [number, number] = useMemo(() => {
    if (properties.length === 0) return [9.0108, 38.7546]; // Default Addis Ababa center

    const coords = properties.map((p) => getCoordinatesForLocation(p.location));
    const avgLat = coords.reduce((sum, [lat]) => sum + lat, 0) / coords.length;
    const avgLng =
      coords.reduce((sum, [, lng]) => sum + lng, 0) / coords.length;

    return [avgLat, avgLng];
  }, [properties]);

  if (!markerIcon) {
    return (
      <div className="rounded-xl overflow-hidden border bg-white h-full w-full" />
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border bg-white h-full w-full relative">
      <MapContainer
        center={center}
        zoom={properties.length === 1 ? 15 : 12}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
        className="z-0"
      >
        <MapResizeHandler />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {properties.map((property, idx) => {
          const coords = getCoordinatesForLocation(property.location);
          return (
            <Marker key={idx} position={coords} icon={markerIcon}>
              <Popup
                className="custom-location-popup"
                maxWidth={380}
                minWidth={320}
                closeButton={false} // removes the "x" (close) icon
              >
                <div className="w-[380px] p-0">
                  <PropertyCard {...property} />
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

// Assuming you have access to a set of icons (like Heroicons, Lucide, or simply Unicode)
// For this example, I'll use simple Unicode symbols (🛏️, 🛁, 🔲) which can be easily replaced.

// Generate a random ID from title if not provided
function generateId(title: string): string {
  // Create a simple hash from the title and add random number
  const hash = title
    .split('')
    .reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
  const random = Math.floor(Math.random() * 10000);
  return `${Math.abs(hash)}-${random}`;
}

export const PropertyCard = ({
  imageUrl,
  title,
  beds,
  baths,
  area,
  id,
}: PropertyCardProps) => {
  const propertyId = id || generateId(title);

  return (
    <Link href={`/properties/${propertyId}`} className="block">
      <div className="flex rounded-md w-full max-w-full overflow-hidden text-gray-800 bg-white p-1 cursor-pointer hover:bg-gray-50 transition-colors">
        <div className="relative w-[110px] h-[80px] shrink-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover rounded-l-md"
          />
        </div>

        <div className="flex-1 min-w-0 p-3 flex flex-col justify-between">
          <h3 className="text-sm font-semibold leading-tight mb-2 line-clamp-2">
            {title}
          </h3>

          <div className="flex items-center justify-between gap-1 text-xs text-gray-600">
            <div className="flex items-center gap-1 min-w-0">
              <Bed className="h-4 w-4 shrink-0" />
              <span className="font-medium">{beds} Beds</span>
            </div>

            <div className="h-4 w-px bg-gray-200 shrink-0" />

            <div className="flex items-center gap-1 min-w-0">
              <Bath className="h-4 w-4 shrink-0" />
              <span className="font-medium">{baths} Baths</span>
            </div>

            <div className="h-4 w-px bg-gray-200 shrink-0" />

            <div className="flex items-center gap-1 min-w-0">
              <Maximize className="h-4 w-4 shrink-0" />
              <span className="font-medium">{area} sqft</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
