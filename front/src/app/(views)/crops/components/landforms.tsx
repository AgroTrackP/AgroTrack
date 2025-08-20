
"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLands } from "@/context/landContext";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-expect-error The Leaflet icon prototype has a typing bug in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

interface LatLng {
  lat: number;
  lng: number;
}

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

const LandForm = () => {
  const [areaUnit, setAreaUnit] = useState<string>('ha');
  const { createLand, isLoading, error, lands } = useLands();
  const [formData, setFormData] = useState({
    nombreCultivo: '',
    tipoPlantacion: '',
    temporada: '',
    areaTerreno: '',
    fechaPlantacion: '',
    latitud: null as number | null,
    longitud: null as number | null,
  });

  const [filters, setFilters] = useState({
    nombreCultivo: '',
    tipoPlantacion: '',
    temporada: '',
  });

  const [showForm, setShowForm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleAreaUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAreaUnit(e.target.value);
  };

  const handleMapClick = (latlng: LatLng) => {
    setFormData((prev) => ({
      ...prev,
      latitud: latlng.lat,
      longitud: latlng.lng,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let areaHectareas = parseFloat(formData.areaTerreno);
    if (areaUnit === 'm2') {
      areaHectareas = areaHectareas / 10000;
    }

    const landData = {
      ...formData,
      areaTerreno: areaHectareas.toString(),
    };

    await createLand(landData);

    setFormData({
      nombreCultivo: '',
      tipoPlantacion: '',
      temporada: '',
      areaTerreno: '',
      fechaPlantacion: '',
      latitud: null,
      longitud: null,
    });
    setAreaUnit('ha');
    setShowForm(false);
  };
  
  const filteredLands = lands.filter(land => {
    const nombreMatch = land.nombreCultivo.toLowerCase().includes(filters.nombreCultivo.toLowerCase());
    const tipoMatch = filters.tipoPlantacion ? land.tipoPlantacion === filters.tipoPlantacion : true;
    const temporadaMatch = filters.temporada ? land.temporada === filters.temporada : true;

    return nombreMatch && tipoMatch && temporadaMatch;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {showForm ? "Formulario de Registro de Cultivo" : "Cultivos Registrados"}
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            + Nuevo Cultivo
          </button>
        )}
      </div>

      {!showForm && (
        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-100 p-4 rounded-lg shadow-inner">
          <input
            type="text"
            name="nombreCultivo"
            placeholder="Filtrar por nombre..."
            value={filters.nombreCultivo}
            onChange={handleFilterChange}
            className="w-full md:w-1/3 border rounded-lg p-2"
          />
          <select
            name="tipoPlantacion"
            value={filters.tipoPlantacion}
            onChange={handleFilterChange}
            className="w-full md:w-1/3 border rounded-lg p-2"
          >
            <option value="">Todos los tipos</option>
            <option value="frutas">Frutas</option>
            <option value="vegetales">Vegetales</option>
            <option value="hortalizas">Hortalizas</option>
            <option value="cereales">Cereales</option>
            <option value="ornamentales">Ornamentales</option>
            <option value="pastos">Pastos</option>
          </select>
          <select
            name="temporada"
            value={filters.temporada}
            onChange={handleFilterChange}
            className="w-full md:w-1/3 border rounded-lg p-2"
          >
            <option value="">Todas las temporadas</option>
            <option value="verano">Verano</option>
            <option value="invierno">Invierno</option>
            <option value="primavera">Primavera</option>
            <option value="otono">Otoño</option>
          </select>
        </div>
      )}
      
      {showForm ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 rounded-2xl shadow"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre del Cultivo:
              </label>
              <input
                type="text"
                name="nombreCultivo"
                value={formData.nombreCultivo}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Plantación:</label>
              <select
                name="tipoPlantacion"
                value={formData.tipoPlantacion}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              >
                <option value="">Selecciona...</option>
                <option value="frutas">Frutas</option>
                <option value="vegetales">Vegetales</option>
                <option value="hortalizas">Hortalizas</option>
                <option value="cereales">Cereales</option>
                <option value="ornamentales">Ornamentales</option>
                <option value="pastos">Pastos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Temporada:</label>
              <select
                name="temporada"
                value={formData.temporada}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              >
                <option value="">Selecciona...</option>
                <option value="verano">Verano</option>
                <option value="invierno">Invierno</option>
                <option value="primavera">Primavera</option>
                <option value="otono">Otoño</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Área:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  id="area"
                  name="areaTerreno"
                  min="0"
                  step="0.01"
                  value={formData.areaTerreno}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2"
                />
                <select
                  value={areaUnit}
                  onChange={handleAreaUnitChange}
                  className="border rounded-lg p-2"
                >
                  <option value="ha">Hectáreas (ha)</option>
                  <option value="m2">Metros Cuadrados (m²)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha de Plantación:
              </label>
              <input
                type="date"
                name="fechaPlantacion"
                value={formData.fechaPlantacion}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              />
            </div>
            {formData.latitud && formData.longitud && (
              <p className="text-sm text-gray-600">
                📍 Coordenadas: Lat {formData.latitud.toFixed(4)}, Lng{" "}
                {formData.longitud.toFixed(4)}
              </p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition"
            >
              {isLoading ? "Guardando..." : "Guardar Cultivo"}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
          <div>
            <h3 className="text-lg font-semibold mb-2">Haz clic en el mapa para marcar las coordenadas:</h3>
            <div className="rounded-2xl overflow-hidden shadow">
              <MapContainer className="z-0" 
                center={[-12.0464, -77.0428]}
                zoom={13}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker onPositionChange={handleMapClick} />
              </MapContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLands.length > 0 ? (
              filteredLands.map((land, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow border-l-4 border-green-500">
                  <p className="text-lg font-semibold">{land.nombreCultivo}</p>
                  <p className="text-gray-600 text-sm">
                    <b>Tipo:</b> {land.tipoPlantacion} | <b>Temporada:</b> {land.temporada}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <b>Área:</b> {parseFloat(land.areaTerreno).toFixed(2)} ha | <b>Fecha:</b> {land.fechaPlantacion}
                  </p>
                  {land.latitud && land.longitud && (
                    <p className="text-xs text-gray-500 mt-2">
                      <b>Coordenadas:</b> Lat {land.latitud.toFixed(4)}, Lng {land.longitud.toFixed(4)}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No se encontraron cultivos que coincidan con los filtros.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandForm;