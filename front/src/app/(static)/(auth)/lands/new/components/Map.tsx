"use client";

import React from 'react';

interface MapProps {
    onLocationSelect: (newCoords: string) => void;
}

export default function Map({ onLocationSelect }: MapProps) {
    const handleSelectLocation = () => {
        const newCoords = "19.4326, -99.1332";
        onLocationSelect(newCoords);
    };

    return (
        <div className="w-full h-96 relative bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
            <p className="text-gray-500 font-bold">
                Aquí se mostraría el mapa interactivo
            </p>


            <button
                onClick={handleSelectLocation}
                className="absolute bottom-4 bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
                Seleccionar Ubicación
            </button>
        </div>
    );
}