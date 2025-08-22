/* eslint-disable @next/next/no-img-element */
// src/app/(admin)/dashboard/users/components/user-table.tsx
import { Pencil, Trash2 } from 'lucide-react';
import { RoleToggle } from './roletoggle'; // <-- 1. Importa el toggle

// 2. Añade 'role' al tipo User
export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  plan: 'Básico' | 'Pro' | 'Premium' | 'not subscription';
  status: 'Activo' | 'Inactivo';
  registrationDate: string;
  role: 'Admin' | 'User'; // <-- Propiedad añadida
};
// Objeto para mapear el estado a colores de Tailwind CSS
const statusColors = {
  Activo: 'bg-green-100 text-green-800',
  Inactivo: 'bg-gray-100 text-gray-800',
};

const planColors = {
  Básico: 'bg-blue-100 text-blue-800',
  Pro: 'bg-purple-100 text-purple-800',
  Premium: 'bg-yellow-100 text-yellow-800',
  'not subscription': 'bg-gray-100 text-gray-800', // <-- Añade el estilo para el nuevo valor
};

export function UserTable({ users, onEdit, onRoleChange }: { users: User[], onEdit: (user: User) => void, onRoleChange: (userId: string, newRole: 'Admin' | 'User') => void }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th /* ... */>Rol</th> {/* <-- 4. Nueva columna */}

            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Registro</th>
            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt="" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[user.status]}`}>
                  {user.status}
                </span>
              </td>
               <td className="px-6 py-4 whitespace-nowrap"> {/* <-- 5. Nueva celda para el rol */}
                <RoleToggle 
                  userId={user.id}
                  initialRole={user.role}
                  onRoleChange={onRoleChange}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${planColors[user.plan]}`}>
                  {user.plan}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.registrationDate}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-4">
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-4">
                  {/* El botón de lápiz ahora llama a la función onEdit */}
                  <button onClick={() => onEdit(user)} className="text-indigo-600 hover:text-indigo-900">
                    <Pencil size={18} />
                  </button>
                  <button className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                </div>
              </td>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}