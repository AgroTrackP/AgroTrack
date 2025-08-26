/* eslint-disable @next/next/no-img-element */
'use client';

import { Pencil, Trash2, Tractor, ArrowDown, ArrowUp } from 'lucide-react';
import { RoleToggle } from './roletoggle';

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  plan: 'Basic' | 'Pro' | 'Premium' | 'not subscription';
  status: 'Activo' | 'Inactivo';
  registrationDate: string;
  role: 'Admin' | 'User';
};

const statusColors = {
  Activo: 'bg-green-100 text-green-800',
  Inactivo: 'bg-gray-100 text-gray-800',
};

const planColors = {
  Basic: 'bg-blue-100 text-blue-800',
  Pro: 'bg-purple-100 text-purple-800',
  Premium: 'bg-yellow-100 text-yellow-800',
  'not subscription': 'bg-gray-100 text-gray-800',
};

export function UserTable({ 
  users, 
  onEdit, 
  onDelete, 
  onRoleChange, 
  onViewPlantations, 
  onSort, 
  sortConfig 
}: { 
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onRoleChange: (userId: string, newRole: 'Admin' | 'User') => void;
  onViewPlantations: (user: User) => void;
  onSort: (key: keyof User) => void;
  sortConfig: { key: keyof User; direction: 'ascending' | 'descending' } | null;
}) {
  
  const renderSortIcon = (key: keyof User) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left">
              <button className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => onSort('name')}>
                Nombre {renderSortIcon('name')}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left">
              <button className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => onSort('status')}>
                Estado {renderSortIcon('status')}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
            <th scope="col" className="px-6 py-3 text-left">
              <button className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => onSort('plan')}>
                Plan {renderSortIcon('plan')}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left">
              <button className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => onSort('registrationDate')}>
                Fecha de Registro {renderSortIcon('registrationDate')}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
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
              <td className="px-6 py-4 whitespace-nowrap">
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
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-4">
                  <button onClick={() => onViewPlantations(user)} className="text-green-600 hover:text-green-900" title="Ver Terrenos">
                    <Tractor size={18} />
                  </button>
                  <button onClick={() => onEdit(user)} className="text-indigo-600 hover:text-indigo-900" title="Editar Usuario">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => onDelete(user)} className="text-red-600 hover:text-red-900" title="Eliminar Usuario">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}