"use client";

import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/context/authContext";
import ProfileUploader from "./profileUploader"; // Asumo que este es el componente para subir la imagen

const UserData = () => {
  const { user, updateCredentials } = useAuthContext(); // ✅ Obtenemos updateCredentials
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Sincroniza el estado del formulario con los datos del usuario
  useEffect(() => {
    if (user) {
      setUsername(user.name); // Asegúrate de que 'name' sea la propiedad correcta para el nombre de usuario
      setEmail(user.email);
    }
  }, [user]);

  if (!user) {
    return <div>No hay datos de usuario disponibles.</div>;
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingUpdate(true);
    setUpdateError(null);

    try {
      const updatedData = {
        name: username, // ✅ Asegúrate de que los nombres de las propiedades coincidan con tu backend
        email: email,
        // Añade aquí cualquier otro campo que el usuario pueda editar
      };
      await updateCredentials(updatedData);
      setIsEditing(false); // Sale del modo edición al guardar
      alert("Perfil actualizado correctamente.");
    } catch (err: any) {
      setUpdateError(err.message || "Error al actualizar el perfil.");
      console.error("Error al actualizar perfil:", err);
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border max-w-xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Información del Usuario
      </h3>
      <ProfileUploader /> {/* Componente para subir la imagen */}
      {updateError && (
        <p className="text-red-500 text-sm mb-4">{updateError}</p>
      )}
      {!isEditing ? (
        // Modo de visualización
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Nombre:</span> {user.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Rol:</span> {user.role}
          </p>
          {/* Aquí puedes añadir más información del usuario */}
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Editar Perfil
          </button>
        </div>
      ) : (
        // Modo de edición (formulario)
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username" // Asegúrate de que el 'name' coincida con tu DTO si es necesario
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              disabled={loadingUpdate}
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              disabled={loadingUpdate}
              required
            />
          </div>
          {/* Añade aquí más campos si el usuario puede editar otros datos */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loadingUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition disabled:opacity-50"
            >
              {loadingUpdate ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={loadingUpdate}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserData;
