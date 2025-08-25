'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/authContext';
import { toast } from 'react-toastify';

// --- Interfaces para la estructura de datos ---
interface IRecommendationDetails {
  planting_notes: string;
  recommended_water_per_m2: string;
  recommended_fertilizer: string;
  additional_notes: string;
  recommended_application_type: { name: string; description: string };
  recommended_diseases: { id: string; name: string; description: string }[];
  // La propiedad que buscamos está DENTRO de recommendations
  recommended_products: IRecommendedProduct[]; 
}


interface IRecommendedProduct {
  id: string;
  name: string;
  description: string;
}

interface IPlantationDetails {
  name: string;
  recommendations: IRecommendationDetails;
  // La propiedad ya no está aquí a nivel principal
}

interface RecommendationsModalProps {
  plantationId: string | null;
  isOpen: boolean;
  onClose: () => void;
}
export function RecommendationsModal({ plantationId, isOpen, onClose }: RecommendationsModalProps) {
  const { token } = useAuthContext();
  const [details, setDetails] = useState<IPlantationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (plantationId && isOpen) {
      const fetchDetails = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`https://agrotrack-develop.onrender.com/plantations/${plantationId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!response.ok) throw new Error("No se pudieron cargar las recomendaciones.");
          const data = await response.json();
          setDetails(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          toast.error(error.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    }
  }, [plantationId, isOpen, token]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recomendaciones para &quot;{details?.name || '...'}&quot;</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        
        {isLoading ? <p>Cargando recomendaciones...</p> : details ? (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 text-left">
            <div>
              <h3 className="font-semibold text-lg border-b pb-1 mb-2">Notas Generales</h3>
              <p><strong>Notas de siembra:</strong> {details.recommendations.planting_notes}</p>
              <p><strong>Agua recomendada:</strong> {details.recommendations.recommended_water_per_m2} L/m²</p>
              <p><strong>Fertilizante:</strong> {details.recommendations.recommended_fertilizer}</p>
              <p><strong>Notas adicionales:</strong> {details.recommendations.additional_notes}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg border-b pb-1 mb-2">Aplicación Recomendada</h3>
              <p><strong>Tipo:</strong> {details.recommendations.recommended_application_type.name}</p>
              <p><strong>Descripción:</strong> {details.recommendations.recommended_application_type.description}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg border-b pb-1 mb-2">Productos Recomendados</h3>
              {/* --- CAMBIO CLAVE AQUÍ --- */}
              {details.recommendations.recommended_products?.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {/* --- Y AQUÍ --- */}
                  {details.recommendations.recommended_products.map(p => <li key={p.id}><strong>{p.name}</strong> </li>)}
                </ul>
              ) : <p className="italic text-gray-500">No hay productos recomendados.</p>}
            </div>
            <div>
              <h3 className="font-semibold text-lg border-b pb-1 mb-2">Enfermedades Comunes a Vigilar</h3>
              {details.recommendations.recommended_diseases?.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {details.recommendations.recommended_diseases.map(d => <li key={d.id}><strong>{d.name}:</strong> {d.description}</li>)}
                </ul>
              ) : <p className="italic text-gray-500">No hay enfermedades recomendadas.</p>}
            </div>
          </div>
        ) : <p>No se encontraron recomendaciones para este terreno.</p>}
        
        <div className="flex justify-end pt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">Cerrar</button>
        </div>
      </div>
    </div>
  );
}