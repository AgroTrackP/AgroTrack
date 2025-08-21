"use client";

import React, { useEffect } from "react";
import { useLands } from "@/context/landContext";

const TerrainInformation = () => {
  const { lands, fetchLands, isLoading, error } = useLands();

  // ✅ Traer terrenos apenas cargue el componente
    useEffect(() => {
        fetchLands();
},      [fetchLands]);

    if (isLoading) {
    return <p className="text-blue-500">⏳ Cargando terrenos...</p>;
}

    if (error) {
    return <p className="text-red-500">❌ Error: {error}</p>;
}

    if (lands.length === 0) {
    return <p className="text-gray-500">No tienes terrenos registrados aún.</p>;
}

return (
    <div className="p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-lg font-bold mb-4">🌱 Mis Terrenos</h2>
<ul className="space-y-3">
        {lands.map((land) => (
        <li
            key={land._id} // 👈 ¡Cambia esto!
            className="p-3 border rounded-lg shadow-sm hover:shadow-md transition"
        >
            <p><strong>Nombre:</strong> {land.name}</p>
            <p><strong>Área:</strong> {land.area_m2} m²</p>
            <p><strong>Tipo de cultivo:</strong> {land.crop_type}</p>
            <p><strong>Ubicación:</strong> {land.location}</p>
            <p><strong>Temporada:</strong> {land.season}</p>
            <p><strong>Fecha de inicio:</strong> {land.start_date}</p> 
        </li>
        ))}
      </ul>
    </div>
  );
};

export default TerrainInformation;

// "use client";

// import React, { useEffect } from "react";
// import { useLands } from "@/context/landContext";

// export default function TerrainInformation() {
//     const { lands, isLoading, fetchLands, error } =  useLands();
//     if (isLoading) return <p>Cargando...</p>;
//     useEffect(() => {
//     fetchLands();
// }, [fetchLands]);

// return (
//     <div className="bg-white p-6 rounded-lg shadow-md border">
//         <h3 className="text-lg font-semibold text-gray-700 mb-4">Terrenos Registrados</h3>
//         {isLoading && <p className="text-center text-gray-500">Cargando terrenos...</p>}
//         {error && <p className="text-red-600 text-sm text-center">Error: {error}</p>}
        
//         {!isLoading && !error && lands.length === 0 && (
//         <p className="text-gray-500 text-center">Aún no tienes terrenos registrados.</p>
//     )}

//     <div className="space-y-4">
//         {lands?.map((land) => (
//             <div key={land.userId} className="p-4 bg-gray-100 rounded-md">
//                 <p className="text-sm text-gray-600">Tipo de cultivo: {land.crop_type}</p>
//                 <p className="text-sm text-gray-600">Temporada: {land.season}</p>
//                 <p className="text-sm text-gray-600">Área: {land.area_m2} m²</p>
//                 <p className="text-sm text-gray-600">Ubicación: {land.location}</p>
//                 <p className="text-sm text-gray-600">Fecha de inicio: {land.start_date}</p>
//             </div>
            
//         ))}
//     </div>
//     </div>
// );
// }

