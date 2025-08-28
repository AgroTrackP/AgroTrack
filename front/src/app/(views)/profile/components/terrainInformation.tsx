"use client";

import React, { useEffect, useState } from "react";
import { useLands } from "@/context/landContext";
import DetalleTerreno from "./detalleTerreno";
import Button from "@/components/ui/button";
import { ConfirmationModal } from "../../(admin)/dashboard/users/components/confirmation-modal";
import { EditPlantationModal } from "../../(admin)/dashboard/users/components/edit-plantation-modal";
import { OverlayLoader } from "@/components/overlay"; // ✅ Importamos overlay

const TerrainInformation = () => {
  const {
    lands,
    fetchLands,
    isLoading,
    error,
    deleteLand,
    totalPages,
    currentPageFromApi,
    totalItems,
  } = useLands();

  const [selectTerrenoId, setSelectTerrenoId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [landIdToDelete, setLandIdToDelete] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [landIdToEdit, setLandIdToEdit] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    fetchLands(currentPageFromApi, itemsPerPage);
  }, [fetchLands, currentPageFromApi, itemsPerPage]);

  // --- Eliminar terreno ---
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

  // --- Editar terreno ---
  const handleEditClick = (landId: string) => {
    setLandIdToEdit(landId);
    setIsEditModalOpen(true);
  };
  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setLandIdToEdit(null);
  };
  const handleSaveSuccess = () => {
    fetchLands(currentPageFromApi, itemsPerPage);
    handleCancelEdit();
  };

  const filteredLands = lands.filter(
    (land) =>
      land.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      land.crop_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginate = (pageNumber: number) => {
    setSearchTerm("");
    fetchLands(pageNumber, itemsPerPage);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-xl relative">
      {/* ✅ Overlay loader bloquea la vista cuando está cargando */}
      {isLoading && <OverlayLoader />}

      {error && <p className="text-red-500">❌ Error: {error}</p>}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">🌱 Mis Terrenos</h2>
        <span className="text-sm text-gray-600 bg-green-100 px-3 py-1 rounded-full">
          <span>Total: {totalItems}</span>
        </span>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o tipo en la página actual..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLands.length > 0 ? (
          filteredLands.map((land) => (
            <li
              key={land.id!}
              className="p-3 border border-gray-200 rounded-lg shadow-sm"
            >
              <p><strong>Nombre:</strong> {land.name}</p>
              <p><strong>Área:</strong> {land.area_m2} m²</p>
              <p><strong>Tipo de cultivo:</strong> {land.crop_type}</p>
              <div className="flex gap-1 items-center mt-5 space-x-2">
                <Button
                  label="Detalle"
                  onClick={() => setSelectTerrenoId(land.id!)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-0.5 px-6 rounded-md"
                />
                <Button
                  label="Modificar"
                  onClick={() => handleEditClick(land.id!)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-0.5 px-3 rounded-md"
                />
                <Button
                  label="Eliminar"
                  onClick={() => handleDeleteClick(land.id!)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-0.5 px-3 rounded-md"
                />
              </div>
            </li>
          ))
        ) : (
          !isLoading && <p className="text-gray-500 col-span-2">No se encontraron terrenos.</p>
        )}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-1">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index + 1}
              label={`${index + 1}`}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1.5 rounded-md text-sm border ${
                currentPageFromApi === index + 1
                  ? "border-gray-500 font-bold"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            />
          ))}
        </div>
      )}

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
        message="¿Estás seguro de que quieres eliminar este terreno?"
      />

      <EditPlantationModal
        isOpen={isEditModalOpen}
        onClose={handleCancelEdit}
        onSave={handleSaveSuccess}
        plantationId={landIdToEdit}
      />
    </div>
  );
};

export default TerrainInformation;
