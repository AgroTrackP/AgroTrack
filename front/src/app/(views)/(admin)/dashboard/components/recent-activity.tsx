'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/authContext';
import { 
  Users, 
  Tractor, 
  LogIn, 
  UserPlus, 
  Pencil, 
  CreditCard, 
  XCircle, 
  type LucideIcon 
} from 'lucide-react';

// --- Interfaz para los datos que esperamos de la API ---
interface ActivityFromApi {
  id: string;
  description: string;
  type: string; // Ej: 'USER_LOGIN', 'PLANTATION_CREATED', etc.
  timestamp: string;
}

// --- Componente de Carga (Skeleton) ---
function ActivitySkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// --- Mapeo de tipos de actividad a íconos ---
// Mapea los tipos de actividad de tu enum a un ícono específico.
const activityIconMap: Record<string, LucideIcon> = {
  USER_LOGIN: LogIn,
  USER_REGISTER: UserPlus,
  PLANTATION_CREATED: Tractor,
  PLANTATION_UPDATED: Pencil,
  SUBSCRIPTION_STARTED: CreditCard,
  SUBSCRIPTION_CANCELED: XCircle,
  DEFAULT: Users, // Un ícono por defecto si el tipo no coincide
};

// --- Función para formatear el tiempo (ej: "Hace 5 minutos") ---
function formatTimeAgo(dateString: string): string {  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `Hace ${Math.floor(interval)} años`;
  interval = seconds / 2592000;
  if (interval > 1) return `Hace ${Math.floor(interval)} meses`;
  interval = seconds / 86400;
  if (interval > 1) return `Hace ${Math.floor(interval)} días`;
  interval = seconds / 3600;
  if (interval > 1) return `Hace ${Math.floor(interval)} horas`;
  interval = seconds / 60;
  if (interval > 1) return `Hace ${Math.floor(interval)} minutos`;
  return `Hace ${Math.floor(seconds)} segundos`;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityFromApi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuth } = useAuthContext();

  useEffect(() => {
    if (!isAuth || !token) {
      setIsLoading(false);
      return;
    }

    const fetchActivities = async () => {
      try {
        const response = await fetch('https://agrotrack-develop.onrender.com/activity/activity-feed?page=1&limit=8', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('No se pudo cargar la actividad reciente.');
        
        const data = await response.json();
        setActivities(data.data); // Asumiendo que la respuesta tiene un campo 'data'

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [token, isAuth]);

  if (isLoading) {
    return <ActivitySkeleton />;
  }

  if (error) {
    return <div className="bg-white p-6 rounded-lg shadow-sm text-red-500">{error}</div>;
  }

 return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Actividad Reciente</h3>
      <ul className="space-y-4">
        {activities.length > 0 ? activities.map((activity) => {
          // 2. SELECCIONA EL ÍCONO CORRECTO
          const Icon = activityIconMap[activity.type] || activityIconMap.DEFAULT;
          return (
            <li key={activity.id} className="flex items-start space-x-3">
              <div className="bg-gray-100 p-2 rounded-full">
                <Icon className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-gray-400">{formatTimeAgo(activity.timestamp)}</p>
              </div>
            </li>
          );
        }) : (
          <p className="text-sm text-gray-500">No hay actividad reciente para mostrar.</p>
        )}
      </ul>
    </div>
  );
}