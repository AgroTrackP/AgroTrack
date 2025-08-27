"use client";

import React, { useState, useEffect } from "react";
import { useLands } from "@/context/landContext";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/authContext";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { toast } from "react-toastify";

// @ts-expect-error The Leaflet icon prototype has a typing bug in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

interface LatLng {
  lat: number;
  lng: number;
}

// ✅ Componente para manejar el marcador en el mapa
function LocationMarker({ onPositionChange }: { onPositionChange: (pos: LatLng) => void }) {
  const [position, setPosition] = useState<LatLng | null>(null);
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onPositionChange(e.latlng);
    },
  });
  return position === null ? null : (
    <Marker position={position}>
      <Popup>📍 Ubicación seleccionada</Popup>
    </Marker>
  );
}

export default function LandForm() {
  const { user } = useAuthContext();
  const { createLand, isLoading, error: landError } = useLands();
  const router = useRouter();
  const { subscription } = useAuthContext();

  const isSubscriptionActive = subscription?.status === 'active';

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const [form, setForm] = useState({
    name: "",
    area_m2: "",
    crop_type: "",
    season: "",
    start_date: "",
    location: "",
  });

  const [areaUnit, setAreaUnit] = useState<string>('m2');
  const [selectedCoords, setSelectedCoords] = useState<LatLng | null>(null);
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAreaUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAreaUnit(e.target.value);
  };

  const handleMapClick = (latlng: LatLng) => {
    setSelectedCoords(latlng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");

    if (!user) return;

    if (!form.name.trim()) {
      toast.error("El nombre del cultivo es obligatorio");
      return;
    }

    if (form.name.length < 3) {
      toast.error("El nombre del cultivo debe tener al menos 3 caracteres");
      return;
    }

    if (!form.area_m2 || parseFloat(form.area_m2) <= 0) {
      toast.error("El área del terreno debe ser mayor que 0");
      return;
    }

    if (!form.crop_type) {
      toast.error("Debe seleccionar un tipo de plantación");
      return;
    }

    if (!form.season) {
      toast.error("La fecha de inicio es obligatoria");
      return;
    }

    if (!selectedCoords) {
      toast.error("Por favor, selecciona una ubicación en el mapa.");
      return;
    }

    if (!isSubscriptionActive) {
      toast.error("Necesitas una suscripción activa para realizar la acción")
      return;
    }

    // ✅ Conversión de la unidad de área antes de enviar
    let area_m2_number = parseFloat(form.area_m2);
    if (areaUnit === 'ha') {
      area_m2_number = area_m2_number * 10000;
    }


    try {
      const dataToSubmit = {
        ...form,
        area_m2: area_m2_number,
        // .toString()
        // ✅ Creamos el string de ubicación desde las coordenadas
        location: `${selectedCoords.lat},${selectedCoords.lng}`,
      };

      await createLand(dataToSubmit);
      toast.success("Terreno registrado correctamente ✅");


      setForm({
        name: "",
        area_m2: "",
        crop_type: "",
        season: "",
        start_date: "",
        location: "",
      });
      setAreaUnit('m2');
      setSelectedCoords(null);

    } catch (err) {
      console.error("Error al registrar terreno:", err);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Registro de Cultivo</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded-2xl shadow"
        >
          {landError && <p className="text-red-600 text-sm">{landError}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          {/* ✅ Todos los inputs y selectores */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre del cultivo</label>
            <input type="text" id="name" name="name" value={form.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          </div>

          <div>
            <label htmlFor="area_m2" className="block text-sm font-medium mb-1">Área del terreno</label>
            <div className="flex items-center space-x-2">
              <input type="number" id="area_m2" name="area_m2" step="0.01" value={form.area_m2} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
              <select value={areaUnit} onChange={handleAreaUnitChange} className="border rounded-lg p-2">
                <option value="m2">Metros Cuadrados (m²)</option>
                <option value="ha">Hectáreas (ha)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="crop_type" className="block text-sm font-medium mb-1">Tipo de plantación</label>
            <select id="crop_type" name="crop_type" value={form.crop_type} onChange={handleChange} required className="w-full border rounded-lg p-2">
              <option value="">Selecciona...</option>
              <option value="Frutas">Frutas</option>
              <option value="Vegetales">Vegetales</option>
              <option value="Hortalizas">Hortalizas</option>
              <option value="Cereales">Cereales</option>
              <option value="Ornamentales">Ornamentales</option>
              <option value="Pastos">Pastos</option>
            </select>
          </div>

          <div>
            <label htmlFor="temporada" className="block text-sm font-medium mb-1">Temporada</label>
            <select id="season" name="season" value={form.season} onChange={handleChange} required className="w-full border rounded-lg p-2">
              <option value="">Selecciona...</option>
              <option value="verano">Verano</option>
              <option value="invierno">Invierno</option>
              <option value="primavera">Primavera</option>
              <option value="otono">Otoño</option>
            </select>
          </div>

          <div>
            <label htmlFor="start_date" className="block text-sm font-medium mb-1">Fecha de inicio</label>
            <input type="date" id="start_date" name="start_date" value={form.start_date} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition disabled:opacity-50"
          >
            {isLoading ? "Guardando..." : "Guardar Terreno"}
          </button>
          {!isSubscriptionActive && (
            <p className="text-center text-sm text-red-600 mt-2">
              Necesitas una suscripción activa para poder usar este formulario
            </p>
          )}
        </form>

        {/* ✅ Lógica del mapa */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Haz clic en el mapa para marcar las coordenadas:</h3>
          <div className="rounded-2xl overflow-hidden shadow">
            <MapContainer className="z-0" center={[-12.0464, -77.0428]} zoom={13} style={{ height: "400px", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker onPositionChange={handleMapClick} />
            </MapContainer>
          </div>
          {/* ✅ Muestra las coordenadas seleccionadas en un input */}
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1">Coordenadas seleccionadas</label>
            <input
              type="text"
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-100"
              value={
                selectedCoords
                  ? `${selectedCoords.lat.toFixed(6)}, ${selectedCoords.lng.toFixed(6)}`
                  : ""
              }
              placeholder="Selecciona una ubicación en el mapa"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
