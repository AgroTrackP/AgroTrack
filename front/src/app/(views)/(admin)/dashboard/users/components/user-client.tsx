'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/authContext';
import { UserTable, type User } from './user-table';
import { Pagination } from './pagination';
import { EditUserModal } from './edit-user-modal';

// 1. AÑADIMOS subscription_plan_id a la interfaz
interface UserFromApi {
  id: string;
  name: string;
  email: string;
  imgUrl: string;
  subscriptionStatus: 'active' | 'none';
  isActive: boolean;
  created_at: string;
  role: 'Admin' | 'User';
  subscription_plan_id: string; // <-- Campo clave
}

// 2. NUEVA FUNCIÓN para traducir el ID del plan a un nombre
const getPlanNameById = (planId: string | null): 'Básico' | 'Pro' | 'Premium' | 'not subscription' => {
  // Si planId es null, undefined o un string vacío, devuelve 'not subscription' inmediatamente.
  if (!planId) {
    return 'not subscription';
  }

  switch (planId) {
    case "d85e4028-3086-46d1-becb-3f16a4915094":
      return 'Básico';
    case "4620a437-e3fd-41d6-93a7-582fdb75107e":
      return 'Pro';
    case "16fa5a9b-37f7-4f27-856b-6a95fe251cdb":
      return 'Premium';
    default:
      return 'not subscription';
  }
};

// "Traductor" de datos del backend al formato del frontend
const mapApiToUser = (usersFromApi: UserFromApi[]): User[] => {
  
  // --- AÑADE ESTA LÍNEA PARA DEPURAR ---
  console.log("Datos CRUDOS que llegan del backend:", usersFromApi);
  // ------------------------------------

  return usersFromApi.map(user => ({
    id: user.id,
    name: user.name,
    role: user.role, // <-- Mapea el rol
    email: user.email,
    avatarUrl: user.imgUrl || `https://i.pravatar.cc/150?u=${user.id}`,
    plan: getPlanNameById(user.subscription_plan_id),
    status: user.isActive ? 'Activo' : 'Inactivo',
    registrationDate: new Date(user.created_at).toLocaleDateString('es-ES'),
  }));
};

export function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { token, isAuth } = useAuthContext();

  useEffect(() => {
    if (!isAuth || !token) return;
    
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://agrotrack-develop.onrender.com/users?page=${currentPage}&limit=${usersPerPage}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('No se pudieron cargar los usuarios.');
        
        const data = await response.json();
        
        setUsers(mapApiToUser(data.data));
        setTotalPages(Math.ceil(data.total / usersPerPage));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, token, isAuth]);

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleUpdateUser = async (updatedData: Partial<User>) => {
    if (!editingUser || !token) return;

    try {
      const response = await fetch(`https://agrotrack-develop.onrender.com/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Error al actualizar el usuario.');
      
      const { user: updatedUserFromApi } = await response.json();
      
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUserFromApi.id ? mapApiToUser([updatedUserFromApi])[0] : u));
      
      handleCloseModal();

    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };
 const handleRoleChange = (userId: string, newRole: 'Admin' | 'User') => {
    setUsers(currentUsers =>
      currentUsers.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-gray-500">Busca, filtra y gestiona los productores de tu plataforma.</p>
        </div>
       
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <input 
          type="text" 
          placeholder="Buscar por nombre o email..." 
          className="w-full lg:w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>
      
      {isLoading && <p className="text-center py-4">Cargando usuarios...</p>}
      {error && <p className="text-center py-4 text-red-500">{error}</p>}
      {!isLoading && !error && (
        <>
           <UserTable 
            users={users} 
            onEdit={handleOpenEditModal}
            onRoleChange={handleRoleChange}
          />
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <EditUserModal
        isOpen={isModalOpen}
        user={editingUser}
        onClose={handleCloseModal}
        onSave={handleUpdateUser}
      />
    </div>
  );
}