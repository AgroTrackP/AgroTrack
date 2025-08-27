/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Loader2, PlusCircle } from "lucide-react"; // Loader2 es un spinner de lucide
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/context/authContext';
import { UserTable, type User } from './user-table';
import { Pagination } from './pagination';
import { EditUserModal } from './edit-user-modal';
import { ConfirmationModal } from './confirmation-modal';
import { CreateUserModal } from './create-user-modal';
import { UserPlantationsModal } from './user-plantation-modal';
import { toast } from 'react-toastify';
import { useDebounce } from '@/hooks/use-debounce';
// --- INTERFACES Y FUNCIONES DE MAPEO ---

interface UserFromApi {
  id: string;
  name: string;
  email: string;
  imgUrl: string;
  isActive: boolean;
  created_at: string;
  role: 'Admin' | 'User';
  suscription_level: { id: string; } | null;
}

const getPlanNameById = (planId: string | null): 'Basic' | 'Pro' | 'Premium' | 'not subscription' => {
  if (!planId) return 'not subscription';
  switch (planId) {
    case "d85e4028-3086-46d1-becb-3f16a4915094": return 'Basic';
    case "4620a437-e3fd-41d6-93a7-582fdb75107e": return 'Pro';
    case "16fa5a9b-37f7-4f27-856b-6a95fe251cdb": return 'Premium';
    default: return 'not subscription';
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getPlanIdByName = (planName: string): string | undefined => {
  const planMap = {
    'Basic': "d85e4028-3086-46d1-becb-3f16a4915094",
    'Pro': "4620a437-e3fd-41d6-93a7-582fdb75107e",
    'Premium': "16fa5a9b-37f7-4f27-856b-6a95fe251cdb",
  };
  return planMap[planName as keyof typeof planMap];
};

const mapApiToUser = (usersFromApi: UserFromApi[]): User[] => {
  return usersFromApi.map(user => ({
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    avatarUrl: user.imgUrl || `https://i.pravatar.cc/150?u=${user.id}`,
    plan: getPlanNameById(user.suscription_level?.id ?? null),
    status: user.isActive ? 'Activo' : 'Inactivo',
    registrationDate: new Date(user.created_at).toLocaleDateString('es-ES'),
  }));
};

// --- COMPONENTE PRINCIPAL ---

export function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 8;
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'ascending' | 'descending' }>({ key: 'name', direction: 'ascending' });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [isPlantationsModalOpen, setIsPlantationsModalOpen] = useState(false);
  const [selectedUserForPlantations, setSelectedUserForPlantations] = useState<User | null>(null);

  const { token, isAuth } = useAuthContext();

  const fetchUsers = useCallback(async () => {
    if (!token || !isAuth) return;
    
    setIsLoading(true);
    setError(null);

    try {
      let url; // 'url' sí necesita ser 'let' porque su valor cambia

      if (debouncedSearchTerm) {
        const params = new URLSearchParams({ query: debouncedSearchTerm });
        url = `https://agrotrack-develop.onrender.com/users/search?${params.toString()}`;
      } else {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(usersPerPage),
          sortBy: sortConfig.key,
          order: sortConfig.direction === 'ascending' ? 'ASC' : 'DESC',
        });
        url = `https://agrotrack-develop.onrender.com/users/admin/users/plantation?${params.toString()}`;
      }
      
      const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });

      if (!response.ok) {
        if (response.status === 404) {
          setUsers([]);
          setTotalPages(0);
          return;
        }
        throw new Error('No se pudieron cargar los usuarios.');
      }
      
      const data = await response.json();
      const usersData = Array.isArray(data) ? data : (data.data || (data ? [data] : []));
      
      setUsers(mapApiToUser(usersData));

      if (debouncedSearchTerm) {
        setTotalPages(usersData.length > 0 ? 1 : 0);
        setCurrentPage(1);
      } else {
        setTotalPages(Math.ceil(data.total / usersPerPage));
      }

    } catch (err: any) {
      setError(err.message);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, sortConfig, token, isAuth]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);


  // --- MANEJADORES DE MODALES Y ACCIONES ---

 const handleOpenEditModal = (user: User) => { setEditingUser(user); setIsEditModalOpen(true); };
  const handleCloseEditModal = () => { setIsEditModalOpen(false); setEditingUser(null); };
  const handleOpenDeleteModal = (user: User) => { setDeletingUser(user); setIsDeleteModalOpen(true); };
  const handleCloseDeleteModal = () => { setIsDeleteModalOpen(false); setDeletingUser(null); };
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleOpenPlantationsModal = (user: User) => { setSelectedUserForPlantations(user); setIsPlantationsModalOpen(true); };
  const handleClosePlantationsModal = () => { setIsPlantationsModalOpen(false); setSelectedUserForPlantations(null); };

  
  const handleUpdateUser = async (updatedData: Partial<User>) => {
    if (!editingUser || !token) return;

    const apiCalls: Promise<Response>[] = [];
    const successMessages: string[] = [];

    // Lógica para el nombre (sin cambios)
    if (updatedData.name && updatedData.name !== editingUser.name) {
      successMessages.push('Nombre actualizado.');
      apiCalls.push(fetch(`https://agrotrack-develop.onrender.com/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: updatedData.name }),
      }));
    }

    // --- LÓGICA PARA EL ESTADO (MODIFICADA) ---
    if (updatedData.status && updatedData.status !== editingUser.status) {
      if (updatedData.status === 'Inactivo') {
        // Si el cambio es para DESACTIVAR
        successMessages.push('Usuario desactivado.');
        apiCalls.push(fetch(`https://agrotrack-develop.onrender.com/users/${editingUser.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        }));
      } else if (updatedData.status === 'Activo') {
        // Si el cambio es para REACTIVAR
        successMessages.push('Usuario reactivado.');
        apiCalls.push(fetch(`https://agrotrack-develop.onrender.com/users/${editingUser.id}/reactivate`, {
          method: 'PATCH', // <-- Usa el método PATCH
          headers: { 'Authorization': `Bearer ${token}` },
        }));
      }
    }

    // Lógica para el plan (sin cambios)
    if (updatedData.plan && updatedData.plan !== editingUser.plan) {
      if (updatedData.plan === 'not subscription'
) {
        successMessages.push('Solicitud de cancelación enviada, este proceso puede tardar 24hs.');
      } else {
        successMessages.push(`Solicitud de cambio a plan ${updatedData.plan} enviada, este proceso puede tardar 24hs.`);
      }
      apiCalls.push(fetch(`https://agrotrack-develop.onrender.com/users/subscription/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ planName: updatedData.plan }),
      }));
    }

    if (apiCalls.length === 0) {
      handleCloseEditModal();
      return;
    }

    try {
      const responses = await Promise.all(apiCalls);
      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Una de las actualizaciones falló.');
        }
      }
      toast.success(successMessages.join(' ') || 'Usuario actualizado con éxito');
      await fetchUsers();
      handleCloseEditModal();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar los cambios.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser || !token) return;
    try {
      const response = await fetch(`https://agrotrack-develop.onrender.com/users/admin/${deletingUser.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al eliminar el usuario.');
      toast.success(`Usuario "${deletingUser.name}" eliminado correctamente.`);
      await fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'No se pudo eliminar al usuario.');
    } finally {
      handleCloseDeleteModal();
    }
  };

  const handleCreateUser = async (newUserData: any) => {
    try {
      const response = await fetch('https://agrotrack-develop.onrender.com/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newUserData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el usuario.');
      }
      toast.success('Usuario creado con éxito.');
      await fetchUsers();
      handleCloseCreateModal();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRoleChange = (userId: string, newRole: 'Admin' | 'User') => {
    // La lógica de API real para esto ya está en RoleToggle.tsx
    // Esto solo actualiza la UI al instante (actualización optimista)
    setUsers(currentUsers =>
      currentUsers.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };
 const handleSort = (key: keyof User) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

return (
  <div className="space-y-6 relative">
    {/* Overlay de carga */}
    {isLoading && (
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="mt-2 text-gray-700 font-medium">Cargando usuarios...</p>
        </div>
      </div>
    )}

    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <p className="text-gray-500">
          Busca, filtra y gestiona los productores de tu plataforma.
        </p>
      </div>
      <button
        onClick={handleOpenCreateModal}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Agregar Usuario
      </button>
    </div>

    <div className="bg-white p-4 rounded-lg shadow-sm">
      <input
        type="text"
        placeholder="Buscar en toda la base de datos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full lg:w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm"
      />
    </div>

    {error && (
      <p className="text-center py-4 text-red-500">{error}</p>
    )}

    {!isLoading && !error && (
      <>
        <UserTable
          users={users}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onRoleChange={handleRoleChange}
          onViewPlantations={handleOpenPlantationsModal}
          onSort={handleSort}
          sortConfig={sortConfig}
        />

        {!debouncedSearchTerm && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </>
    )}

    <CreateUserModal
      isOpen={isCreateModalOpen}
      onClose={handleCloseCreateModal}
      onSave={handleCreateUser}
    />
    <EditUserModal
      isOpen={isEditModalOpen}
      user={editingUser}
      onClose={handleCloseEditModal}
      onSave={handleUpdateUser}
    />
    <ConfirmationModal
      isOpen={isDeleteModalOpen}
      onClose={handleCloseDeleteModal}
      onConfirm={handleConfirmDelete}
      title="Confirmar Eliminación"
      message={`¿Estás seguro de que quieres eliminar a ${deletingUser?.name}? Esta acción no se puede deshacer.`}
    />
    <UserPlantationsModal
      isOpen={isPlantationsModalOpen}
      user={selectedUserForPlantations}
      onClose={handleClosePlantationsModal}
    />
  </div>
);
}