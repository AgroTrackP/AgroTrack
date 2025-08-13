import React, { useState, useCallback } from "react";
import { useDropzone, Accept } from "react-dropzone";

const ProfileUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    }
}, []);

const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [] } as Accept,
    multiple: false,
});

const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);

    try {
      // 1️⃣ Subir imagen a Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "TU_UPLOAD_PRESET"); // Reemplazar con tu preset

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/TU_CLOUD_NAME/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await cloudinaryRes.json();
      if (!data.secure_url) throw new Error("Error subiendo a Cloudinary");

      // 2️⃣ Enviar SOLO la URL al backend
      const backendRes = await fetch("/api/users/upload-avatar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: data.secure_url }),
      });

      if (!backendRes.ok) throw new Error("Error guardando en backend");

      alert("¡Foto actualizada!");
      setPreview(data.secure_url);
    } catch (error) {
      alert("No se pudo subir la imagen.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          relative w-40 h-40 rounded-full cursor-pointer overflow-hidden
          border-2 border-dashed transition-colors duration-300
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        `}
      >
        <input {...getInputProps()} />

        <img
          src={preview || "/default-avatar.png"}
          alt="Previsualización"
          className="w-full h-full object-cover"
        />

        <div
          className="
            absolute inset-0 bg-black bg-opacity-50 text-white
            flex flex-col items-center justify-center
            opacity-0 hover:opacity-100 transition-opacity duration-300
          "
        >
          {isDragActive ? (
            <p className="text-center font-semibold">¡Suelta la imagen!</p>
          ) : (
            <p className="text-center font-semibold">📸 Cambiar Foto</p>
          )}
        </div>
      </div>

      {preview && (
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className="
            px-6 py-2 bg-blue-600 text-white font-bold rounded-lg
            hover:bg-blue-700 transition-colors
            disabled:bg-gray-400 disabled:cursor-not-allowed
          "
        >
          {isLoading ? "Guardando..." : "Guardar Foto"}
        </button>
      )}
    </div>
  );
};

export default ProfileUploader;