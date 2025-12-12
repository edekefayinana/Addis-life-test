'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

// Office location coordinates (Kirkos, Addis Ababa - approximate)
const OFFICE_LOCATION: [number, number] = [9.0054, 38.7636];

// Custom marker icon - simple circle marker
const customIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `
    <div style="
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: white;
      border: 4px solid #003246;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #003246;
      "></div>
    </div>
  `,
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  popupAnchor: [0, -25],
});

// Custom Recenter Control Component
function RecenterControl() {
  const map = useMap();

  useEffect(() => {
    // Create custom control
    const RecenterButton = L.Control.extend({
      options: {
        position: 'topleft',
      },
      onAdd: function () {
        const container = L.DomUtil.create(
          'div',
          'leaflet-bar leaflet-control'
        );
        const button = L.DomUtil.create(
          'a',
          'leaflet-control-recenter',
          container
        );
        button.href = '#';
        button.title = 'Recenter to office location';
        button.className =
          'leaflet-control-recenter flex items-center justify-center';
        button.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;

        L.DomEvent.on(button, 'click', function (e) {
          L.DomEvent.preventDefault(e);
          map.flyTo(OFFICE_LOCATION, 15, {
            duration: 1.5,
          });
        });

        return container;
      },
    });

    const recenterControl = new RecenterButton();
    map.addControl(recenterControl);

    return () => {
      map.removeControl(recenterControl);
    };
  }, [map]);

  return null;
}

function MapContent() {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    // Open popup when component mounts
    const marker = markerRef.current;
    if (marker) {
      marker.openPopup();
    }
  }, []);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterControl />
      <Marker ref={markerRef} position={OFFICE_LOCATION} icon={customIcon}>
        <Popup
          closeButton={false}
          autoClose={false}
          closeOnClick={false}
          className="custom-location-popup"
        >
          <div className="p-5 min-w-[360px]">
            <div className="flex gap-1 flex-col">
              {/* Company Logo */}
              <div className="flex items-center gap-2">
                <div className="shrink-0 bg-white border rounded-sm shadow-sm p-2">
                  <Image
                    src="/logo.svg"
                    alt="Addis Life Real Estate PLC"
                    width={55}
                    className="object-contain"
                    height={40}
                  />
                </div>
                <h3 className="font-bold text-lg font-instrument">
                  Addis Life Real Estate PLC
                </h3>
              </div>
              {/* Company Information */}
              <div className="flex-1">
                <p className="font-semibold text-lg leading-tight">
                  Kirkos, In front of Africa union
                </p>
                <p className="text-base -mt-4 text-description leading-relaxed">
                  Kirkos, Woreda 06, in front of Africa union, Addis Ababa
                  Ethiopia
                </p>
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
}

export default function Map() {
  return (
    <MapContainer
      center={OFFICE_LOCATION}
      zoom={15}
      scrollWheelZoom={true}
      className="h-full w-full rounded-2xl overflow-hidden"
      style={{ height: '100%', width: '100%' }}
    >
      <MapContent />
    </MapContainer>
  );
}
