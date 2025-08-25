/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuthContext } from '@/context/authContext';
import { toast } from "react-toastify";

// Arreglo para el ícono por defecto de Leaflet en Next.js
// @ts-expect-error El prototipo del ícono de Leaflet tiene un bug de tipado en Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// --- INTERFACES ---
interface LatLng { lat: number; lng: number; }
export interface PlantationFormData {
  name: string;
  area_m2: number;
  crop_type: string;
  season: string;
  start_date: string;
  location: string;
}

interface EditPlantationModalProps {
  plantationId: string | null;
  isOpen: boolean;
  onClose: () => void;
  // --- CORRECCIÓN AQUÍ ---
  // La prop onSave ahora espera un ID de tipo string y los datos del formulario.
  onSave: (plantationId: string, data: PlantationFormData) => void; 
}

// --- COMPONENTE INTERNO DEL MAPA ---
function LocationMarker({ position, onPositionChange }: { position: LatLng, onPositionChange: (pos: LatLng) => void }) {
  const map = useMapEvents({
    click(e) { onPositionChange(e.latlng); },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>📍 Ubicación seleccionada</Popup>
    </Marker>
  );
}

// --- COMPONENTE PRINCIPAL DEL MODAL ---
export function EditPlantationModal({ plantationId, isOpen, onClose, onSave }: EditPlantationModalProps) {
  const { token } = useAuthContext();
  const [formData, setFormData] = useState({
    name: "",
    area_m2: "", // El input del form siempre maneja strings
    crop_type: "",
    season: "",
    start_date: "",
  });
  const [areaUnit, setAreaUnit] = useState<string>('m2');
  const [selectedCoords, setSelectedCoords] = useState<LatLng | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (plantationId && isOpen) {
      const fetchPlantationDetails = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`https://agrotrack-develop.onrender.com/plantations/${plantationId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!response.ok) throw new Error("No se pudieron cargar los datos del terreno.");
          
          const data = await response.json();
          
          setFormData({
            name: data.name,
            area_m2: String(data.area_m2),
            crop_type: data.crop_type,
            season: data.season,
            start_date: data.start_date.split('T')[0],
          });

          const [lat, lng] = data.location.split(',').map(Number);
          setSelectedCoords({ lat, lng });

        } catch (error: any) {
          toast.error(error.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPlantationDetails();
    }
  }, [plantationId, isOpen, token]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleAreaUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => setAreaUnit(e.target.value);
  const handleMapClick = (latlng: LatLng) => setSelectedCoords(latlng);

const handleSubmit = async (e: React.FormEvent) => {    e.preventDefault();
    if (!selectedCoords) {
      toast.warn("Por favor, selecciona una ubicación en el mapa.");
      return;
    }

    let area_m2_number = parseFloat(formData.area_m2);
    if (areaUnit === 'ha') {
      area_m2_number *= 10000;
    }

    const dataToSubmit = {
      name: formData.name,
      crop_type: formData.crop_type,
      season: formData.season,
      start_date: formData.start_date,
      location: `${selectedCoords.lat},${selectedCoords.lng}`,
      area_m2: area_m2_number,
    };

    try {
      const response = await fetch(`https://agrotrack-develop.onrender.com/plantations/${plantationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(dataToSubmit),
      });
      if (!response.ok) throw new Error("Error al guardar los cambios.");
      
      toast.success("Terreno actualizado con éxito.");
      if (plantationId) {
        onSave(plantationId, {
          name: dataToSubmit.name,
          area_m2: dataToSubmit.area_m2,
          crop_type: dataToSubmit.crop_type,
          season: dataToSubmit.season,
          start_date: dataToSubmit.start_date,
          location: dataToSubmit.location,
        });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-6">Editar Terreno</h2>
        {isLoading ? <p>Cargando datos del terreno...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre del cultivo</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
              </div>
              <div>
                <label htmlFor="area_m2" className="block text-sm font-medium mb-1">Área del terreno</label>
                <div className="flex items-center space-x-2">
                  <input type="number" id="area_m2" name="area_m2" step="0.01" value={formData.area_m2} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
                  <select value={areaUnit} onChange={handleAreaUnitChange} className="border rounded-lg p-2">
                    <option value="m2">m²</option>
                    <option value="ha">ha</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="crop_type" className="block text-sm font-medium mb-1">Tipo de plantación</label>
                <select id="crop_type" name="crop_type" value={formData.crop_type} onChange={handleChange} required className="w-full border rounded-lg p-2">
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
                <label htmlFor="season" className="block text-sm font-medium mb-1">Temporada</label>
                <select id="season" name="season" value={formData.season} onChange={handleChange} required className="w-full border rounded-lg p-2">
                  <option value="">Selecciona...</option>
                  <option value="verano">Verano</option>
                  <option value="invierno">Invierno</option>
                  <option value="primavera">Primavera</option>
                  <option value="otono">Otoño</option>
                </select>
              </div>
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium mb-1">Fecha de inicio</label>
                <input type="date" id="start_date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Guardar Cambios</button>
              </div>
            </form>
            <div>
              <h3 className="text-lg font-semibold mb-2">Haz clic para cambiar la ubicación:</h3>
              <div className="rounded-lg overflow-hidden shadow h-[400px]">
                {selectedCoords && (
                  <MapContainer className="z-0" center={selectedCoords} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker position={selectedCoords} onPositionChange={handleMapClick} />
                  </MapContainer>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}