/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import axios from "axios";
import { useAuthContext } from "@/context/authContext";
import { toast } from "react-toastify";

const ProfileImageUploader = () => {
    const { user, setUser, token } = useAuthContext();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    if (!user) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
    }
};

const handleUpload = async () => {
    if (!selectedFile || !user || !token) {
        alert("Faltan datos para subir la imagen (usuario o token)");
        return;
    }

    setLoading(true);

    try {
        console.log("📤 Subiendo imagen para usuario:", user.id);
        console.log("📄 Archivo seleccionado:", selectedFile.name);

        const formData = new FormData();
        formData.append("file", selectedFile);
        
      // Subir imagen al backend
        const cloudinaryRes = await axios.put(
        `https://agrotrack-develop.onrender.com/cloudinary/perfil/${user.id}`,
        formData,
    {
            headers: {
            Authorization: `Bearer ${token}`,
        },
    }
);
        console.log("✅ Respuesta Cloudinary:", cloudinaryRes.data);
        // 🔹 URL devuelta por backend / cloudinary
        const imageUrl =
            cloudinaryRes.data.url ||
            cloudinaryRes.data.secure_url ||
            cloudinaryRes.data.imageUrl;

    if (!imageUrl) {
        throw new Error("No se recibió la URL de la imagen del backend");
    }

    console.log("Token:", token);


    setUser((prev) =>
        (prev ? { ...prev, imgUrl: imageUrl } : prev
        ));
        toast.success("Imagen actualizada correctamente ✅");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error subiendo imagen:", error.message);
            console.error("Status:", error.response?.status);
            console.error("Response data:", error.response?.data);
            console.error(token); 
            console.log(user.id);// Aquí vemos el motivo del 403
    } else {
        console.error(error);
    }
        alert("Error al subir la imagen");
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
    </label>

    <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
    />

    {selectedFile && (
        <p className="text-sm text-gray-600"></p>
    )}

    <button
        onClick={handleUpload}
        disabled={loading || !selectedFile}
        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
        {loading ? "Subiendo..." : "Subir foto"}
    </button>
    </div>
);
};

export default ProfileImageUploader;
