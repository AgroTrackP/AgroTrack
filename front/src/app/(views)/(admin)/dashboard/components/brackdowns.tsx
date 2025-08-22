'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/authContext';

// 1. ACTUALIZAMOS LA INTERFAZ para que coincida con los datos reales
interface UserFromApi {
  suscription_level: { // El nombre de la propiedad es 'suscription_level'
    id: string;      // Y es un objeto con una propiedad 'id'
  } | null;            // Puede ser nulo si no hay suscripción
}

// ... (El resto de las interfaces y constantes no cambian)
interface ChartData {
  name: string;
  value: number;
  color: string;
}
const planColors = {
  Básico: '#6ee7b7',
  Pro: '#3b82f6',
  Premium: '#a855f7',
};

export function SubscriptionBreakdown() {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuth } = useAuthContext();

  useEffect(() => {
    if (isAuth === null || !isAuth || !token) {
      setIsLoading(false);
      return;
    }

    const fetchAndProcessUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://agrotrack-develop.onrender.com/users?page=1&limit=1000', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Error al obtener la lista de usuarios.');

        const userData = await response.json();
        const users: UserFromApi[] = userData.data;

        const planCounts = { 'Básico': 0, 'Pro': 0, 'Premium': 0 };

        users.forEach(user => {
          // 2. CORREGIMOS CÓMO LEEMOS EL ID DEL PLAN
          // Usamos 'user.suscription_level?.id' para acceder al ID de forma segura
          switch (user.suscription_level?.id) {
            case "d85e4028-3086-46d1-becb-3f16a4915094":
              planCounts['Básico']++;
              break;
            case "4620a437-e3fd-41d6-93a7-582fdb75107e":
              planCounts['Pro']++;
              break;
            case "16fa5a9b-37f7-4f27-856b-6a95fe251cdb":
              planCounts['Premium']++;
              break;
            default:
              break;
          }
        });
        
        const formattedData = [
          { name: 'Básico', value: planCounts['Básico'], color: planColors.Básico },
          { name: 'Pro', value: planCounts['Pro'], color: planColors.Pro },
          { name: 'Premium', value: planCounts['Premium'], color: planColors.Premium }
        ];

        setData(formattedData);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessUserData();
  }, [token, isAuth]);

  // ... (El resto del componente, incluyendo el JSX, no cambia)
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
function PieChartSkeleton() {
  // Asegúrate de que esta palabra 'return' exista
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