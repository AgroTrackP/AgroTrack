"use client";

import React, { useEffect, useState } from "react";
import { LandData, LandUpdateData, useLands } from "@/context/landContext";
import DetalleTerreno from "./detalleTerreno";
import Button from "@/components/ui/button";
import { ConfirmationModal } from "../../(admin)/dashboard/users/components/confirmation-modal";
import EditLandModal from "./editLandModal";


const TerrainInformation = () => {
  const {
    lands,
    fetchLands,
    isLoading,
    error,
    deleteLand,
    updateLand,
    totalPages,
    currentPageFromApi,
    totalItems, // 👈 total global de terrenos
  } = useLands();

  const [selectTerrenoId, setSelectTerrenoId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [landIdToDelete, setLandIdToDelete] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [landToEdit, setLandToEdit] = useState<LandData |  null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 5;

  useEffect(() => {
    fetchLands(currentPageFromApi, itemsPerPage);
  }, [fetchLands, currentPageFromApi, itemsPerPage]);

  // --- Eliminar ---
  const handleDeleteClick = (landId: string) => {
    setLandIdToDelete(landId);
    setIsDeleteModalOpen(true);
  };
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setLandIdToDelete(null);
  };
  const handleConfirmDelete = async () => {
    if (landIdToDelete) {
      await deleteLand(landIdToDelete);
      handleCancelDelete();
    }
  };

  // --- Editar ---
  const handleEditClick = (land: LandData) => {
    setLandToEdit(land);
    setIsEditModalOpen(true);
  };
  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setLandToEdit(null);
  };
  const handleConfirmEdit = async (updatedData: LandUpdateData) => {
    if (landToEdit) {
      //const { id, ...dataToSend } = updatedData;
      await updateLand(landToEdit.id!, updatedData);
      handleCancelEdit();
    }
  };

  if (isLoading) return <p className="text-blue-500">⏳ Cargando terrenos...</p>;
  if (error) return <p className="text-red-500">❌ Error: {error}</p>;

  const filteredLands = lands.filter(
    (land) =>
      land.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      land.crop_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      land.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginate = (pageNumber: number) => {
    setSearchTerm("");
    fetchLands(pageNumber, itemsPerPage);
  };

  if (lands.length === 0 && !searchTerm && !isLoading) {
    return <p className="text-gray-500">No tienes terrenos registrados aún.</p>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg rounded-xl">
      {/* Header con total global */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">🌱 Mis Terrenos</h2>
        <span className="text-sm text-gray-600 bg-green-100 px-3 py-1 rounded-full">
        <span>Total: {totalItems}</span>
        </span>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, tipo o ubicación en la página actual..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
        />
      </div>

      {/* Lista de terrenos */}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLands.length === 0 ? (
          <p className="text-gray-500 col-span-2">No se encontraron terrenos.</p>
        ) : (
          filteredLands.map((land) => (
            <li
              key={land.id!}
              className="p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200 bg-gray-50"
            >
              <p className="text-gray-700">
                <strong>Nombre:</strong> {land.name}
              </p>
              <p className="text-gray-700">
                <strong>Área:</strong> {land.area_m2} m²
              </p>
              <p className="text-gray-700">
                <strong>Tipo de cultivo:</strong> {land.crop_type}
              </p>
              <p className="text-gray-700">
                <strong>Ubicación:</strong> {land.location}
              </p>

              <div className="flex gap-1 items-center mt-5 space-x-2">
                <Button
                  label="Detalle"
                  onClick={() => setSelectTerrenoId(land.id!)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-0.5 px-6 rounded-md transition duration-200"
                />
                <Button
                  label="Modificar"
                  onClick={() => handleEditClick(land)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-0.5 px-3 rounded-md transition duration-200"
                />
                <Button
                  label="Eliminar"
                  onClick={() => handleDeleteClick(land.id!)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-0.5 px-3 rounded-md transition duration-200"
                />
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-1">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index + 1}
              label={`${index + 1}`}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1.5 rounded-md text-sm transition duration-200 
                border ${
                  currentPageFromApi === index + 1
                    ? "border-gray-500 font-bold text-gray-900"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
            />
          ))}
        </div>
      )}

      {/* Modales */}
      <DetalleTerreno
        isOpen={!!selectTerrenoId}
        terrenoId={selectTerrenoId}
        onClose={() => setSelectTerrenoId(null)}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar este terreno? Esta acción no se puede deshacer."
      />
      {landToEdit && (
        <EditLandModal
          isOpen={isEditModalOpen}
          onClose={handleCancelEdit}
          onConfirm={handleConfirmEdit}
          landData={landToEdit}
        />
      )}
    </div>
  );
};

export default TerrainInformation;




