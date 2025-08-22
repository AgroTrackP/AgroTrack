"use client";

import React, { SetStateAction } from 'react';

import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as unknown as {_getIconUrl?: unknown})._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}
interface MapProps {
  onLocationSelect: (newCoords: SetStateAction<string>) => void;
}

const LocationMarker = ({ onLocationSelect }: { onLocationSelect: (coords: string) => void }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const coordsString = `${lat},${lng}`;
      onLocationSelect(coordsString);
    },
  });
  return null;
};


export default function Map({ onLocationSelect }: MapProps) {
  return (
    <div className="w-full h-96 relative">
      <MapContainer
        center={[20.6736, -103.344]} 
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full rounded"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}