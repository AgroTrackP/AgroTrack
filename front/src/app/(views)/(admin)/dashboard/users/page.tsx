// src/app/(admin)/dashboard/users/page.tsx

import { PlusCircle } from 'lucide-react';
// 1. IMPORTA EL TIPO Y EL COMPONENTE
import { UserTable, type User } from './components/user-table';

// 2. USA EL TIPO PARA ASEGURAR QUE LOS DATOS SON CORRECTOS
async function getFakeUsers(): Promise<User[]> {
  return [
    { id: '1', name: 'Juan Pérez', email: 'juan.perez@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=1', plan: 'Pro', status: 'Activo', registrationDate: '2024-08-15' },
    { id: '2', name: 'María Gómez', email: 'maria.gomez@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=2', plan: 'Premium', status: 'Activo', registrationDate: '2024-07-22' },
    { id: '3', name: 'Carlos López', email: 'carlos.lopez@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=3', plan: 'Básico', status: 'Inactivo', registrationDate: '2024-06-01' },
    { id: '4', name: 'Ana Martínez', email: 'ana.martinez@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=4', plan: 'Pro', status: 'Activo', registrationDate: '2024-05-19' },
    { id: '5', name: 'Luis Fernández', email: 'luis.fernandez@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=5', plan: 'Básico', status: 'Activo', registrationDate: '2024-08-02' },
    { id: '6', name: 'Laura García', email: 'laura.garcia@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=6', plan: 'Premium', status: 'Inactivo', registrationDate: '2024-03-10' },
  ];
}

export default async function UsersPage() {
  const users = await getFakeUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-gray-500">Busca, filtra y gestiona los productores de tu plataforma.</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2">
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Usuario
        </button>
      </div>

      {/* Barra de Controles: Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
        <input 
          type="text" 
          placeholder="Buscar por nombre o email..." 
          className="w-full lg:w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option>Filtrar por plan...</option>
          <option>Básico</option>
          <option>Pro</option>
          <option>Premium</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option>Filtrar por estado...</option>
          <option>Activo</option>
          <option>Inactivo</option>
        </select>
      </div>

      {/* Ahora TypeScript sabe que `users` es del tipo correcto */}
      <UserTable users={users} />
    </div>
  );
}