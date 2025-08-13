"use client"

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png"
import iconUrl from "leaflet/dist/images/marker-icon.png"
import shadowUrl from "leaflet/dist/images/marker-shadow.png"


delete (L.Icon.Default.prototype as unknown as {_getIconUrl?: () => void})._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl
})


function LocationSelector({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
    const [position, setPosition] = useState<[number, number] | null>(null);

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            onSelect(lat, lng); 
        }
    });

    return position ? (
        <Marker position={position}>
            <Popup>📍 Ubicación seleccionada</Popup>
        </Marker>
    ) : null;
}

export default function Map({ onLocationSelect }: { onLocationSelect: (coords: string) => void }) {
    return (
        <MapContainer
            center={[-12.0464, -77.0428]} 
            zoom={13}
            style={{ height: "500px", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationSelector
                onSelect={(lat, lng) => {
                    onLocationSelect(`${lat}, ${lng}`);
                }}
            />
        </MapContainer>
    );
}

