'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/authContext'; // Ajusta la ruta a tu contexto
import { Target } from 'lucide-react';

// 1. AÑADIMOS la propiedad 'subscriptionStatus' a la interfaz
interface User {
  created_at: string;
  subscriptionStatus: string; 
}

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
        const response = await fetch('https://agrotrack-develop.onrender.com/users?page=1&limit=1000', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch users list');
        
        const responseData = await response.json();
        const users: User[] = responseData.data;

        // --- AÑADE ESTE CONSOLE.LOG ---
        console.log("Usuarios recibidos del backend:", users);
        // -----------------------------
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const newUsersCount = users.filter(user => {
            const registrationDate = new Date(user.created_at);
            const isRecent = registrationDate >= thirtyDaysAgo;
            const isActive = user.subscriptionStatus === 'active';
            return isRecent && isActive;
        }).length;
        
        setCount(newUsersCount);

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
        <p className="text-sm text-gray-500">Nuevas Subs Activas (30d)</p>
        <p className="text-2xl font-bold">{displayValue}</p>
      </div>
    </div>
  );
}