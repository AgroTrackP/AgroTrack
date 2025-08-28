'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/authContext'; // Ajusta la ruta a tu contexto
import { Users } from 'lucide-react';

export function ActiveProducersCard() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isAuth } = useAuthContext();

  useEffect(() => {
    if (isAuth === null || !isAuth || !token) {
      setIsLoading(false);
      return;
    }

    const fetchTotalUsers = async () => {
      try {
        // 1. Apuntamos al endpoint de usuarios (ajusta la ruta si es diferente)
        const response = await fetch('https://agrotrack-develop.onrender.com/users/admin/users/plantation', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        
        // 2. Extraemos el campo "total" de la respuesta
        const data = await response.json();
        setTotalUsers(data.total);

      } catch (error) {
        console.error(error);
        setTotalUsers(null); // Indica que hubo un error
      } finally {
        setIsLoading(false);
      }
    };
    fetchTotalUsers();
  }, [token, isAuth]);

  // Renderiza un estado de carga, el valor, o un error
  const displayValue = isLoading 
    ? <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
    : totalUsers !== null 
      ? totalUsers.toLocaleString('es-AR') 
      : 'Error';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
      <div className="bg-green-100 p-3 rounded-full">
        <Users className="h-6 w-6 text-green-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">Productores Activos</p>
        <p className="text-2xl font-bold">{displayValue}</p>
      </div>
    </div>
  );
}