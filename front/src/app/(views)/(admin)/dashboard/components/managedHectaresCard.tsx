'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/authContext'; // Ajusta la ruta a tu contexto
import { Globe } from 'lucide-react';

// Definimos la estructura de una plantación que recibimos de la API
interface Plantation {
  id: string;
  area_m2: string; // El área viene como string
  // ...otras propiedades que no necesitamos para este cálculo
}

export function ManagedHectaresCard() {
  const [totalHectares, setTotalHectares] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isAuth } = useAuthContext();

  useEffect(() => {
    if (isAuth === null || !isAuth || !token) {
      setIsLoading(false);
      return;
    }

    const fetchHectaresData = async () => {
      try {
        // 1. Apuntamos al endpoint de plantaciones
        const response = await fetch('https://agrotrack-develop.onrender.com/plantations', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch plantations');
        
        const plantations: Plantation[] = await response.json();

        // 2. Usamos 'reduce' para sumar todas las "area_m2"
        const totalM2 = plantations.reduce((sum, plantation) => {
          const area = parseFloat(plantation.area_m2);
          // Sumamos solo si el valor es un número válido
          return sum + (isNaN(area) ? 0 : area);
        }, 0);

        // 3. Convertimos el total de metros cuadrados a hectáreas (1 ha = 10,000 m²)
        const hectares = totalM2 / 10000;
        setTotalHectares(hectares);

      } catch (error) {
        console.error(error);
        setTotalHectares(null); // Indica que hubo un error
      } finally {
        setIsLoading(false);
      }
    };
    fetchHectaresData();
  }, [token, isAuth]);

  // Renderiza un estado de carga, el valor formateado, o un error
  const displayValue = isLoading 
    ? <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
    : totalHectares !== null 
      ? `${totalHectares.toLocaleString('es-AR', { maximumFractionDigits: 2 })} ha`
      : 'Error';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
      <div className="bg-yellow-100 p-3 rounded-full">
        <Globe className="h-6 w-6 text-yellow-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">Hectáreas Gestionadas</p>
        <p className="text-2xl font-bold">{displayValue}</p>
      </div>
    </div>
  );
}