'use client';

import { useState } from 'react';
import { useAuthContext } from '@/context/authContext';
import { toast } from 'react-toastify';

interface PlantationStatusToggleProps {
  plantationId: string;
  initialStatus: boolean;
  onStatusChange: (plantationId: string, newStatus: boolean) => void;
}

export function PlantationStatusToggle({ plantationId, initialStatus, onStatusChange }: PlantationStatusToggleProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthContext();

  const handleChange = async () => {
    if (!token) {
      toast.error("Error de autenticación.");
      return;
    }

    setIsLoading(true);
    const newStatus = !initialStatus;
    const endpoint = newStatus ? 'activate' : 'deactivate';

    try {
      // Revisa que esta URL sea la correcta
      const response = await fetch(`https://agrotrack-develop.onrender.com/plantations/${plantationId}/${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`, // Se envía el token
        },
      });

      if (!response.ok) throw new Error('Error al cambiar el estado del terreno.');
      
      toast.success(`Terreno ${newStatus ? 'activado' : 'desactivado'}.`);
      onStatusChange(plantationId, newStatus); // Se notifica al padre para actualizar la UI

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "No se pudo cambiar el estado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={initialStatus}
        onChange={handleChange}
        disabled={isLoading}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
    </label>
  );
}