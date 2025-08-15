"use client";
import React, { useState } from "react";
import axios from "axios";
import { useAuthContext } from "@/context/authContext";
import Image from "next/image";

const ProfileImageUploader = () => {

    const { user, setUser } = useAuthContext();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !user) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            const cloudinaryRes = await axios.put(
                `http://localhost:3010/cloudinary/perfil/${user.id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            const imageUrl = cloudinaryRes.data.url;
            const updateRes = await axios.put(
                `http://localhost:3010/usuarios/${user.id}`,
                { profileImage: imageUrl }
            );

            setUser({ ...user, picture: imageUrl });
            localStorage.setItem("user", JSON.stringify({ ...user, picture: imageUrl }));
            alert("Imagen de perfil actualizada correctamente");

            setSelectedFile(null);
            setPreviewUrl(null);

        } catch (error) {
            console.error("Error subiendo imagen:", error);
            alert("Ocurrió un error al subir la imagen");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <h2 className="text-xl font-semibold text-gray-800">Foto de perfil</h2>

            <label htmlFor="file-input" className="relative cursor-pointer">
                <Image
                    // La imagen muestra la foto actual del usuario o un avatar por defecto
                    src={previewUrl || user?.picture || "/default-avatar.png"}
                    alt=""
                    width={128}   
                    height={128} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 bg-gray-400"
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
            {
                selectedFile && (
                    <p className="text-sm text-gray-600">Archivo: {selectedFile.name}</p>
                )
            }
            <button
                onClick={handleUpload}
                disabled={loading || !selectedFile}
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {loading ? "Subiendo..." : "Subir foto"}
            </button>
        </div >
    );
};

export default ProfileImageUploader;