'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/authContext';
import { Target } from 'lucide-react';

export function NewSubscriptionsCard() {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isAuth } = useAuthContext();

  useEffect(() => {
    if (isAuth === null || !isAuth || !token) {
      setIsLoading(false);
      return;
    }

    const fetchNewSubsCount = async () => {
      try {
        // 1. Apuntamos al nuevo endpoint. Asumo que el prefijo es 'subscription-plan'.
        const response = await fetch('https://agrotrack-develop.onrender.com/subscription-plan/new-last-30-days', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch new subscriptions count');
        }
        
        // 2. Extraemos el conteo directamente de la respuesta.
        const data = await response.json();
        setCount(data.newSubscriptions);

      } catch (error) {
        console.error(error);
        setCount(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewSubsCount();
  }, [token, isAuth]);

  const displayValue = isLoading 
    ? <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
    : count !== null 
      ? `+${count.toLocaleString('es-AR')}` 
      : 'Error';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
      <div className="bg-red-100 p-3 rounded-full">
        <Target className="h-6 w-6 text-red-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">Nuevas Subs (30d)</p>
        <p className="text-2xl font-bold">{displayValue}</p>
      </div>
    </div>
  );
}