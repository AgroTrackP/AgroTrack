/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { useAuthContext } from "@/context/authContext";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react"; // Importa el ícono de carga

const ProfileImageUploader = () => {
    const { user, setUser, token } = useAuthContext();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    if (!user) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
            if(!validTypes.includes(file.type)) {
                toast.error("Solo se permiten imágenes JPG, PNG o WEBP.");
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !user || !token) {
            toast.error("Por favor, selecciona un archivo primero.");
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            
            const response = await fetch(
                `https://agrotrack-develop.onrender.com/cloudinary/perfil/${user.id}`,
                {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error: ${response.status}`);
            }
            
            const responseData = await response.json();
            const imageUrl = responseData.url || responseData.secure_url || responseData.imageUrl;
            if (!imageUrl) {
                throw new Error("No se recibió la URL de la imagen del backend");
            }

            // Actualiza el estado del usuario en el contexto
            setUser((prev) => (prev ? { ...prev, imgUrl: imageUrl, picture: imageUrl } : prev));
            
            toast.success("Imagen actualizada correctamente ✅");
            setSelectedFile(null); // Limpia el archivo seleccionado
            setPreviewUrl(null);   // Limpia la previsualización

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
                console.error("Error subiendo imagen:", error.message);
            } else {
                toast.error("Error al subir la imagen");
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <h2 className="text-xl font-semibold text-gray-800">Foto de perfil</h2>

            <label htmlFor="file-input" className="relative cursor-pointer">
                <img
                    src={previewUrl || user?.imgUrl || user?.picture || "/default-avatar.png"}
                    alt="Foto de perfil"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                    📸 Cambiar
                </div>
                
                {/* --- OVERLAY DE CARGA --- */}
                {loading && (
                    <div className="absolute inset-0 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
                    </div>
                )}
            </label>

            <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {selectedFile && (
                <div className="text-center">
                    <p className="text-sm text-gray-600"></p>
                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="mt-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? "Subiendo..." : "Confirmar y Subir"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileImageUploader;