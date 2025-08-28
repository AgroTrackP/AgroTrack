'use client';

import { useState } from 'react';
import { useAuthContext } from '@/context/authContext';

interface RoleToggleProps {
  userId: string;
  initialRole: 'Admin' | 'User';
  onRoleChange: (userId: string, newRole: 'Admin' | 'User') => void;
}

export function RoleToggle({ userId, initialRole, onRoleChange }: RoleToggleProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthContext();

  const handleChange = async () => {
    setIsLoading(true);
    const newRole = initialRole === 'Admin' ? 'User' : 'Admin';
    const endpoint = newRole === 'Admin' ? 'make-admin' : 'remove-admin';

    try {
      const response = await fetch(`https://agrotrack-develop.onrender.com/users/${userId}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al cambiar el rol.');

      onRoleChange(userId, newRole);

    } catch (error) {
      console.error(error);
      // Aquí podrías mostrar una notificación de error con toast
    } finally {
      setIsLoading(false);
    }
  };

  const isChecked = initialRole === 'Admin';
  // --- 1. LÓGICA PARA EL TEXTO DEL TOOLTIP ---
  const tooltipText = isChecked ? 'Quitar rol de Administrador' : 'Hacer Administrador';

  return (
    // --- 2. AÑADIMOS EL ATRIBUTO 'title' AL CONTENEDOR ---
    <div className="flex items-center space-x-2" title={tooltipText}>
      <span className={`text-sm font-medium ${isChecked ? 'text-gray-400' : 'text-gray-900'}`}></span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          disabled={isLoading}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
      <span className={`text-sm font-medium ${isChecked ? 'text-gray-900' : 'text-gray-400'}`}></span>
    </div>
  );
}