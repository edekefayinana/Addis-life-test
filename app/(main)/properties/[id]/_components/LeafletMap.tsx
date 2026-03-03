'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { PropertyCard } from '../../_components/PropertiesMap';

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

type LeafletMapProps = {
  position: [number, number];
  address?: string;
  title?: string;
  beds?: number;
  baths?: number;
  area?: number;
  imagesFolder?: string;
};

export function LeafletMap({
  position,
  address,
  title,
  beds,
  baths,
  area,
  // imagesFolder,
}: LeafletMapProps) {
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by <a href="https://www.openstreetmap.fr">OpenStreetMap France</a>'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={markerIcon}>
          <Popup
            className="custom-location-popup"
            maxWidth={380}
            minWidth={320}
            closeButton={false}
          >
            <div className="w-[380px] p-0">
              <PropertyCard
                {...{
                  id: 'map-property',
                  title: title || 'Property Location',
                  overview: {
                    built_start_date: '',
                    property_type: 'Residential',
                    current_status: '',
                  },
                  property_details: {
                    total_bedrooms: beds || 0,
                    total_bathrooms: baths || 0,
                    parking_space: 0,
                    area_size_m2: area || 0,
                    available_floors: 'Not Available',
                    building_size: '',
                    delivery_time: '',
                  },
                  amenities: [],
                  location_and_surroundings: { nearby_places: [] },
                  location: {
                    address: address || 'Unknown Address',
                    city: '',
                    country: '',
                    longitude: position[1],
                    latitude: position[0],
                  },
                  images: [],
                  totalBedrooms: beds || 0,
                  totalBathrooms: baths || 0,
                  areaSizeM2: area || 0,
                  latitude: position[0],
                  longitude: position[1],
                }}
              />
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
