'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/authContext';

// --- Estructura que necesita el componente para renderizar ---
interface ChartData {
  name: string;
  value: number;
  color: string;
}

// --- Mapeo de nombres de planes a colores ---
const planColors = {
  Basic: '#6ee7b7',
  Pro: '#3b82f6',
  Premium: '#a855f7',
};

// --- Componente para el estado de carga (Skeleton) ---
function PieChartSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="w-64 h-64 mx-auto bg-gray-200 rounded-full"></div>
      <div className="mt-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
      </div>
    </div>
  );
}

export function SubscriptionBreakdown() {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuth } = useAuthContext();

  useEffect(() => {
    if (!isAuth || !token) {
      setIsLoading(false);
      return;
    }

    const fetchSubscriptionData = async () => {
      setIsLoading(true);
      try {
        // Apuntamos al nuevo endpoint que devuelve los conteos
        const response = await fetch('https://agrotrack-develop.onrender.com/subscription-plan/stats/user-counts', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Error al obtener el desglose de suscripciones.');
        }

        const counts: { basic: number; pro: number; premium: number } = await response.json();
        
        // Transformamos el objeto recibido en el array que el gráfico necesita
        const formattedData: ChartData[] = [
          { name: 'Basic', value: counts.basic, color: planColors.Basic },
          { name: 'Pro', value: counts.pro, color: planColors.Pro },
          { name: 'Premium', value: counts.premium, color: planColors.Premium }
        ];
        setData(formattedData);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [token, isAuth]);

  if (isLoading) { return <PieChartSkeleton />; }
  if (error) { return <div className="bg-white p-6 rounded-lg shadow-sm text-red-500">{error}</div>; }

  const totalSubscriptions = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Desglose de Suscripciones</h3>
      <div className="relative w-64 h-64 mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
          {data.map((item, index) => {
            const angle = totalSubscriptions > 0 ? (item.value / totalSubscriptions) * 360 : 0;
            const startAngle = totalSubscriptions > 0 ? data.slice(0, index).reduce((sum, i) => sum + (i.value / totalSubscriptions) * 360, 0) : 0;
            const pathData = describeArc(100, 100, 100, startAngle, startAngle + angle);
            const textRadius = 75;
            const textPosition = polarToCartesian(100, 100, textRadius, startAngle + angle / 2);

            return (
              <g key={item.name}>
                <path d={pathData} fill={item.color} />
                {item.value > 0 && (
                  <text
                    x={textPosition.x}
                    y={textPosition.y}
                    fill="black"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontSize="14"
                    dominantBaseline="central"
                    transform={`rotate(90 ${textPosition.x} ${textPosition.y})`}
                  >
                    {Math.round((item.value / totalSubscriptions) * 100)}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center bg-white w-24 h-24 rounded-full flex flex-col justify-center">
          <strong className="text-2xl font-semibold">{totalSubscriptions}</strong>
          <p className="text-sm text-gray-500">Total</p>
        </div>
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Funciones auxiliares para dibujar el SVG ---
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
  if (endAngle - startAngle >= 360) endAngle = startAngle + 359.99;
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y, 'L', x, y, 'Z'].join(' ');
  return d;
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
}