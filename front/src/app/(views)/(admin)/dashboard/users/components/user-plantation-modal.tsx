'use client';

import { useState, useEffect, useCallback } from 'react';
import { type User } from './user-table';
import { useAuthContext } from '@/context/authContext';
import { EditPlantationModal } from './edit-plantation-modal';
import { RecommendationsModal } from './recommendation-modal';
import { Pagination } from './pagination';
import { Lightbulb } from 'lucide-react';

interface Plantation {
  id: string;
  name: string;
  area_m2: string;
  crop_type: string;
}

interface UserPlantationsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserPlantationsModal({ user, isOpen, onClose }: UserPlantationsModalProps) {
  const [plantations, setPlantations] = useState<Plantation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;
  const [editingPlantation, setEditingPlantation] = useState<Plantation | null>(null);
  const [viewingRecsForId, setViewingRecsForId] = useState<string | null>(null);

  const fetchPlantations = useCallback(async () => {
    if (isOpen && user?.id && token) {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(itemsPerPage),
        });
        
        const response = await fetch(`https://agrotrack-develop.onrender.com/plantations/user/${user.id}?${params.toString()}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Error al cargar los terrenos');
        
        const data = await response.json();
        
        // CORRECCIÓN: Extrae el array 'data' de la respuesta
        setPlantations(data.data || []);
        
        setTotalPages(data.totalPages || Math.ceil(data.total / itemsPerPage));
      } catch (error) {
        console.error(error);
        setPlantations([]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isOpen, user, token, currentPage]);

  useEffect(() => {
    fetchPlantations();
  }, [fetchPlantations]);

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;
  
  const handleSaveSuccess = () => {
    setEditingPlantation(null);
    fetchPlantations();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Terrenos de {user?.name}</h2>
          {isLoading ? (
            <div className="flex-grow min-h-[300px] flex items-center justify-center">
              <p>Cargando terrenos...</p>
            </div>
          ) : (
            <div className="space-y-2 flex-grow min-h-[300px] max-h-[60vh] overflow-y-auto pr-2">
              {plantations.length > 0 ? plantations.map(p => (
                <div key={p.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-gray-500">{p.crop_type} - {p.area_m2} m²</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => setViewingRecsForId(p.id)} className="p-2 bg-yellow-400 text-white rounded hover:bg-yellow-500" title="Ver Recomendaciones">
                      <Lightbulb size={16} />
                    </button>
                    <button onClick={() => setEditingPlantation(p)} className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">Editar</button>
                  </div>
                </div>
              )) : (
                <div className="flex-grow min-h-[300px] flex items-center justify-center">
                  <p>Este usuario no tiene terrenos registrados.</p>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t">
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
          
          <button onClick={onClose} className="mt-6 px-4 py-2 bg-gray-300 rounded-md self-center">Cerrar</button>
        </div>
      </div>
      
      <EditPlantationModal 
        isOpen={!!editingPlantation}
        plantationId={editingPlantation?.id || null}
        onClose={() => setEditingPlantation(null)}
        onSave={handleSaveSuccess}
      />
      
      <RecommendationsModal 
        isOpen={!!viewingRecsForId}
        plantationId={viewingRecsForId}
        onClose={() => setViewingRecsForId(null)}
      />
    </>
  );
}