"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

type MapProps = {
  onLocationSelect?: (coords: string) => void; // OPCIONAL
};

function LocationSelector({ onLocationSelect = () => {} }: { onLocationSelect?: (coords: string) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const c = `${lat}, ${lng}`;
      setPosition([lat, lng]);
      onLocationSelect && onLocationSelect(c);
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












// "use client";

// import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { useState } from "react";

// // Configuración de los iconos de Leaflet
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
//     iconUrl: require("leaflet/dist/images/marker-icon.png"),
//     shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
// });

// interface MapProps {
//     onLocationSelect?: (coords: string) => void;
// }

// function LocationSelector({ onLocationSelect }: { onLocationSelect: (coords: string) => void }) {
//     const [position, setPosition] = useState<[number, number] | null>(null);

//     useMapEvents({
//         click(e) {
//             const { lat, lng } = e.latlng;
//             setPosition([lat, lng]);
//             onLocationSelect(`${lat}, ${lng}`);
//         },
//     });

//     return position ? (
//         <Marker position={position}>
//             <Popup>📍 Ubicación seleccionada</Popup>
//         </Marker>
//     ) : null;
// }

// export default function Map({ onLocationSelect = () => { } }: MapProps) {
//     return (
//         <div style={{ width: "100%", minHeight: "400px", flex: 1, position: "relative", zIndex: 0 }}>
//             <MapContainer
//                 center={[-12.0464, -77.0428]}
//                 zoom={13}
//                 style={{ width: "100%", height: "100%" }}
//             >
//                 <TileLayer
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//                 <LocationSelector onLocationSelect={onLocationSelect} />
//             </MapContainer>
//         </div>

//     );
// }