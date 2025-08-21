"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

interface Coords {
  lat: number;
  lng: number;
}

type MapProps = {
  onLocationSelect?: (coords: Coords) => void;
};

function LocationSelector({ onLocationSelect = () => {} }: { onLocationSelect?: (coords: Coords) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect({ lat, lng });
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>📍 Ubicación seleccionada</Popup>
    </Marker>
  ) : null;
}

export default function Map({ onLocationSelect = () => {} }: MapProps) {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: 300, position: "relative", zIndex: 0 }}>
      <MapContainer center={[-12.0464, -77.0428]} zoom={13} style={{ width: "100%", height: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationSelector onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}











