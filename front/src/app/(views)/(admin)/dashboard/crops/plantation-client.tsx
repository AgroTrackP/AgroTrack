'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/context/authContext';
import { PlantationsTable, type Plantation } from './components/plantation-table';
import { Pagination } from '../users/components/pagination';
import { toast } from 'react-toastify';
import { EditPlantationModal } from '../users/components/edit-plantation-modal';
import { RecommendationsModal } from '../users/components/recommendation-modal';
import { useDebounce } from '@/hooks/use-debounce';

// Interfaz de datos que vienen de la API
interface PlantationFromApi {
  id: string;
  name: string;
  area_m2: number;
  crop_type: string;
  start_date: string;
  season: string;
  user: { name: string; };
  isActive: boolean;
}

// Función para mapear datos de la API al formato del frontend
const mapApiToPlantation = (data: PlantationFromApi[]): Plantation[] => {
  return data.map(p => ({
    id: p.id,
    name: p.name,
    ownerName: p.user?.name || 'Sin Asignar',
    area_m2: p.area_m2,
    crop_type: p.crop_type,
    startDate: new Date(p.start_date).toLocaleDateString('es-ES'),
    isActive: p.isActive,
  }));
};

export function PlantationsClient() {
  const [plantations, setPlantations] = useState<Plantation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  
  const [sortConfig, setSortConfig] = useState<{ key: keyof Plantation; direction: 'ascending' | 'descending' }>({ key: 'name', direction: 'ascending' });

  const [cropFilter, setCropFilter] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('');
  const [ownerSearch, setOwnerSearch] = useState('');
  const debouncedOwnerSearch = useDebounce(ownerSearch, 500);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlantation, setEditingPlantation] = useState<Plantation | null>(null);

  const [viewingRecsForId, setViewingRecsForId] = useState<string | null>(null);

  const { token, isAuth } = useAuthContext();

  const fetchPlantations = useCallback(async () => {
    if (!token || !isAuth) return;
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(itemsPerPage),
        sortBy: sortConfig.key,
        order: sortConfig.direction === 'ascending' ? 'ASC' : 'DESC',
      });
      if (cropFilter) params.append('crop_type', cropFilter);
      if (seasonFilter) params.append('season', seasonFilter);
      if (debouncedOwnerSearch) params.append('ownerName', debouncedOwnerSearch);

      const response = await fetch(`https://agrotrack-develop.onrender.com/plantations/paginated?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('No se pudieron cargar los terrenos.');
      
      const data = await response.json();
      setPlantations(mapApiToPlantation(data.data));
      setTotalPages(data.totalPages || Math.ceil(data.total / itemsPerPage));

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [token, isAuth, currentPage, cropFilter, seasonFilter, sortConfig, debouncedOwnerSearch]);

  useEffect(() => {
    fetchPlantations();
  }, [fetchPlantations]);

  const handleSort = (key: keyof Plantation) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };
  
  const handleOpenEditModal = (plantation: Plantation) => {
    setEditingPlantation(plantation);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingPlantation(null);
  };
  const handleSavePlantation = async () => {
    await fetchPlantations();
    handleCloseEditModal();
  };
  
  const handleStatusChange = (plantationId: string, newStatus: boolean) => {
    setPlantations(currentPlantations =>
      currentPlantations.map(p =>
        p.id === plantationId ? { ...p, isActive: newStatus } : p
      )
    );
  };

  const handleOpenRecsModal = (plantation: Plantation) => {
    setViewingRecsForId(plantation.id);
  };
  const handleCloseRecsModal = () => {
    setViewingRecsForId(null);
  };

  if (isLoading) return <p className="text-center py-4">Cargando terrenos...</p>;
  if (error) return <p className="text-center py-4 text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Todos los Terrenos</h1>
      
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap items-center gap-4">
        <select value={cropFilter} onChange={(e) => { setCropFilter(e.target.value); setCurrentPage(1); }} className="border rounded-lg p-2 text-sm">
          <option value="">Todos los Cultivos</option>
          <option value="Frutas">Frutas</option>
          <option value="Vegetales">Vegetales</option>
          <option value="Hortalizas">Hortalizas</option>
          <option value="Cereales">Cereales</option>
          <option value="Ornamentales">Ornamentales</option>
          <option value="Pastos">Pastos</option>
        </select>
        <select value={seasonFilter} onChange={(e) => { setSeasonFilter(e.target.value); setCurrentPage(1); }} className="border rounded-lg p-2 text-sm">
          <option value="">Todas las Temporadas</option>
          <option value="verano">Verano</option>
          <option value="invierno">Invierno</option>
          <option value="primavera">Primavera</option>
          <option value="otono">Otoño</option>
        </select>
        <input 
          type="text"
          placeholder="Buscar por propietario..."
          value={ownerSearch}
          onChange={(e) => setOwnerSearch(e.target.value)}
          className="border rounded-lg p-2 text-sm w-full sm:w-auto"
        />
      </div>
      
      <PlantationsTable 
        plantations={plantations}
        onSort={handleSort}
        sortConfig={sortConfig}
        onEdit={handleOpenEditModal}
        onStatusChange={handleStatusChange}
        onViewRecs={handleOpenRecsModal}
      />

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <EditPlantationModal
        isOpen={isEditModalOpen}
        plantationId={editingPlantation?.id || null}
        onClose={handleCloseEditModal}
        onSave={handleSavePlantation}
      />

      <RecommendationsModal
        isOpen={!!viewingRecsForId}
        plantationId={viewingRecsForId}
        onClose={handleCloseRecsModal}
      />
    </div>
  );
}