'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/authContext'; // Ajusta la ruta a tu contexto

// Estructura de los datos que necesita el gráfico
interface ChartData {
  name: string; // Ej: "Ago"
  total: number;
}

// Componente para el estado de carga (Skeleton)
function ChartSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="w-full h-80 flex items-end justify-around space-x-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-1 h-full bg-gray-200 rounded-t-lg"></div>
        ))}
      </div>
    </div>
  )
}

export function SalesChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token, isAuth } = useAuthContext();

  useEffect(() => {
    if (isAuth === null) return;

    if (!token || !isAuth) {
      setError("No estás autenticado para ver estos datos.");
      setIsLoading(false);
      return;
    }

    const fetchSalesData = async () => {
      setIsLoading(true);
      try {
        // 1. Apuntamos al endpoint que devuelve el total del mes actual
        const response = await fetch('https://agrotrack-develop.onrender.com/stripe/monthly-revenue', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los ingresos del mes.');
        }

        const currentMonthRevenue = await response.json();
        
        // 2. Procesamos el único valor para adaptarlo a la estructura del gráfico
        const processedData = processDataForChart(currentMonthRevenue.grossRevenue);
        setData(processedData);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesData();
  }, [token, isAuth]);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (error) {
    return <div className="bg-white p-6 rounded-lg shadow-sm text-red-500">{error}</div>;
  }
  
  const maxSales = Math.max(...data.map(item => item.total), 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Ventas de los últimos 6 meses</h3>
      <div className="w-full h-80 pt-6 flex items-end justify-around space-x-2 md:space-x-4">
        {data.map((month) => {
          // Si el máximo es 0, todas las barras tendrán altura 0
          const barHeight = maxSales > 0 ? `${(month.total / maxSales) * 100}%` : '0%';
          return (
            <div key={month.name} className="flex flex-col items-center flex-1 h-full">
              <div className="relative w-full h-full flex items-end">
                <div className="absolute left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-600" style={{ bottom: `calc(${barHeight} + 4px)` }}>
                  {/* Solo muestra el valor si es mayor que 0 */}
                  {month.total > 0 ? `$${month.total.toLocaleString('es-AR')}` : ''}
                </div>
                <div className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600" style={{ height: barHeight }}/>
              </div>
              <p className="mt-2 text-xs text-gray-500">{month.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 3. Nueva función de procesamiento de datos
function processDataForChart(currentMonthRevenue: number): ChartData[] {
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const result: ChartData[] = [];
  const today = new Date(); // Fecha actual: 22 de Agosto, 2025

  // Genera los datos para los últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthIndex = d.getMonth(); // ej. para Agosto, será 7
    const currentMonthIndex = today.getMonth(); // 7

    result.push({
      name: monthNames[monthIndex],
      // Si el mes del bucle es el mes actual, usa el valor de la API. Si no, 0.
      total: monthIndex === currentMonthIndex ? currentMonthRevenue : 0,
    });
  }

  return result; // Devuelve ej: [{name: 'Mar', total: 0}, ..., {name: 'Ago', total: 12500.50}]
}