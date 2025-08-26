"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button"; // Asegúrate que la ruta sea correcta

interface LandFormData {
  id?: string;
  name: string;
  area_m2: number;
  crop_type: string;
  season: string;
  location: string;
  start_date: string;
}

interface EditLandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: LandFormData) => void;
  landData: LandFormData;
}

const EditLandModal: React.FC<EditLandModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  landData,
}) => {
  const [formData, setFormData] = useState<LandFormData>({
    ...landData,
    area_m2: landData.area_m2 || 0,
    start_date: landData.start_date
      ? new Date(landData.start_date).toISOString().split("T")[0]
      : "",
  });

  useEffect(() => {
    if (landData) {
      setFormData({
        ...landData,
        area_m2: landData.area_m2 || 0,
        start_date: landData.start_date
          ? new Date(landData.start_date).toISOString().split("T")[0]
          : "",
      });
    }
  }, [landData]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "area_m2"
          ? Number(value) // 👈 siempre lo convertimos a número
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData); // ✅ ya está tipado con number
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          ✏️ Modificar Terreno
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            {/* Área */}
            <div>
              <label
                htmlFor="area_m2"
                className="block text-sm font-medium text-gray-700"
              >
                Área (m²)
              </label>
              <input
                type="number"
                name="area_m2"
                id="area_m2"
                value={formData.area_m2}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            {/* Tipo de Cultivo */}
            <div>
              <label
                htmlFor="crop_type"
                className="block text-sm font-medium text-gray-700"
              >
                Tipo de Cultivo
              </label>
              <select
                name="crop_type"
                id="crop_type"
                value={formData.crop_type}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Selecciona...</option>
                <option value="Frutas">Frutas</option>
                <option value="Vegetales">Vegetales</option>
                <option value="Hortalizas">Hortalizas</option>
                <option value="Cereales">Cereales</option>
                <option value="Ornamentales">Ornamentales</option>
                <option value="Pastos">Pastos</option>
              </select>
            </div>

            {/* Ubicación */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Ubicación
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            {/* Temporada */}
            <div>
              <label
                htmlFor="season"
                className="block text-sm font-medium text-gray-700"
              >
                Temporada
              </label>
              <select
                name="season"
                id="season"
                value={formData.season}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Selecciona...</option>
                <option value="verano">Verano</option>
                <option value="invierno">Invierno</option>
                <option value="primavera">Primavera</option>
                <option value="otono">Otoño</option>
              </select>
            </div>

            {/* Fecha */}
            <div>
              <label
                htmlFor="start_date"
                className="block text-sm font-medium text-gray-700"
              >
                Fecha de Inicio
              </label>
              <input
                type="date"
                name="start_date"
                id="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          {/* Botones */}
          <div className="mt-8 flex justify-end space-x-3">
            <Button
              label="Cancelar"
              onClick={onClose}
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-black"
            />
            <Button
              label="Guardar Cambios"
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLandModal;


