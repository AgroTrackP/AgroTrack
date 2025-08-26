'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/authContext'; // Ajusta la ruta a tu contexto
import { BarChart } from 'lucide-react';

export function MonthlyRevenueCard() {
  const [revenue, setRevenue] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isAuth } = useAuthContext();

  useEffect(() => {
    if (isAuth === null || !isAuth || !token) {
      setIsLoading(false);
      return;
    }

    const fetchRevenue = async () => {
      try {
        const response = await fetch('https://agrotrack-develop.onrender.com/stripe/monthly-revenue', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch revenue');
        const data = await response.json();
        console.log(data)
        
        setRevenue(data.grossRevenue);
        console.log(revenue)
      } catch (error) {
        console.error(error);
        setRevenue(null); // Indica que hubo un error
      } finally {
        setIsLoading(false);
      }
    };
    fetchRevenue();
  }, [token, isAuth, revenue]);

  const displayValue = isLoading 
    ? <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
    : revenue !== null 
      ? `$${revenue.toLocaleString('es-AR')}` 
      : 'Error';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
      <div className="bg-blue-100 p-3 rounded-full">
        <BarChart className="h-6 w-6 text-blue-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">Ingresos del Mes (USD)</p>
        <p className="text-2xl font-bold">{displayValue}</p>
      </div>
    </div>
  );
}