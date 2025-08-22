// src/app/(admin)/dashboard/_components/recent-activity.tsx
import { Users, Tractor, Wheat } from 'lucide-react';

const mockActivity = [
  {
    icon: Users,
    text: 'Productor "Juan Pérez" se suscribió al Plan Pro.',
    time: 'Hace 5m',
  },
  {
    icon: Tractor,
    text: 'Se agregó un nuevo lote de 50ha en Córdoba.',
    time: 'Hace 2h',
  },
  {
    icon: Wheat,
    text: '"María Gómez" inició una nueva siembra de Soja.',
    time: 'Hace 8h',
  },
  {
    icon: Users,
    text: 'Productor "Carlos López" actualizó sus datos.',
    time: 'Ayer',
  },
];

export function RecentActivity() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-96">
      <h3 className="font-semibold text-lg mb-4">Actividad Reciente</h3>
      <ul className="space-y-4">
        {mockActivity.map((activity, index) => (
          <li key={index} className="flex items-start space-x-3">
            <div className="bg-gray-100 p-2 rounded-full">
              <activity.icon className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm">{activity.text}</p>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}