/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

type Property = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  totalBedrooms: number;
  totalBathrooms: number;
  areaSizeM2: number;
  images: { url: string }[];
  [key: string]: any;
};

type PropertiesMapProps = {
  properties: Property[];
};

export function PropertiesMap({ properties }: PropertiesMapProps) {
  const [markerIcon, setMarkerIcon] = useState<L.Icon | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    let mounted = true;

    const loadLeaflet = async () => {
      const leaflet = await import('leaflet');
      if (!mounted) return;
      setMarkerIcon(
        leaflet.icon({
          iconUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
      );
    };

    if (typeof window !== 'undefined') {
      loadLeaflet();
    }

    return () => {
      mounted = false;
    };
  }, []);

  // Calculate center based on all properties
  const center: [number, number] = useMemo(() => {
    if (properties.length === 0) return [9.0108, 38.7546]; // Default Addis Ababa center

    const validProperties = properties.filter(
      (p) =>
        p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude)
    );

    if (validProperties.length === 0) return [9.0108, 38.7546];

    const avgLat =
      validProperties.reduce((sum, p) => sum + p.latitude, 0) /
      validProperties.length;
    const avgLng =
      validProperties.reduce((sum, p) => sum + p.longitude, 0) /
      validProperties.length;

    return [avgLat, avgLng];
  }, [properties]);

  if (!isClient || !markerIcon) {
    return (
      <div className="rounded-xl overflow-hidden border bg-white h-full w-full" />
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border bg-white h-full w-full relative">
      <MapContainer
        center={center}
        zoom={properties.length === 1 ? 19 : 14}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
        className="z-0"
      >
        <MapResizeHandler />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by <a href="https://www.openstreetmap.fr">OpenStreetMap France</a>'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {properties
          .filter(
            (p) =>
              p.latitude &&
              p.longitude &&
              !isNaN(p.latitude) &&
              !isNaN(p.longitude)
          )
          .map((property) => {
            const coords: [number, number] = [
              property.latitude,
              property.longitude,
            ];
            return (
              <Marker key={property.id} position={coords} icon={markerIcon}>
                <Popup
                  className="custom-location-popup"
                  maxWidth={380}
                  minWidth={320}
                  closeButton={false}
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

export const PropertyCard = ({
  id,
  title,
  totalBedrooms,
  totalBathrooms,
  areaSizeM2,
  images,
}: Property) => {
  const resolvedImage = images?.[0]?.url || '/property-1.jpg';

  // Generate slug from title if id is not provided (same as main PropertyCard)
  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const propertyId = id || slugify(title);

  return (
    <Link href={`/properties/${propertyId}`} className="block">
      <div className="flex rounded-md w-full max-w-full overflow-hidden text-gray-800 bg-white p-1 cursor-pointer hover:bg-gray-50 transition-colors">
        <div className="relative w-[110px] h-20 shrink-0">
          <Image
            src={resolvedImage}
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
              <span className="font-medium">{totalBedrooms} Beds</span>
            </div>

            <div className="h-4 w-px bg-gray-200 shrink-0" />

            <div className="flex items-center gap-1 min-w-0">
              <Bath className="h-4 w-4 shrink-0" />
              <span className="font-medium">{totalBathrooms} Baths</span>
            </div>

            <div className="h-4 w-px bg-gray-200 shrink-0" />

            <div className="flex items-center gap-1 min-w-0">
              <Maximize className="h-4 w-4 shrink-0" />
              <span className="font-medium">{areaSizeM2} m²</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
