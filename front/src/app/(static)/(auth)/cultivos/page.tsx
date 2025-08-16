"use client"

import { useSearchParams } from "next/navigation"
import { useState,useEffect } from "react";

interface Cultivo {
  name: string;
  area_m2: number;
  crop_type: string;
  location: string;
  start_date: string;
}


export default function MisCultivosPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [cultivo, setCultivo] = useState<Cultivo | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCultivo = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mis-cultivos/${id}`, {
          credentials: "include", 
        });
        if (!res.ok) throw new Error("Error al obtener datos");
        const data = await res.json();
        setCultivo(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCultivo();
  }, [id]);

  if (!cultivo) {
    return <p className="text-center">Cargando datos...</p>;
  }
    return (
        <main className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-2xl font-semibold text-center"> Detalles del terreno </h2>

            <div>
                <p><strong>Nombre:</strong>{cultivo.name}</p>
                <p><strong>Área (m²):</strong> {cultivo.area_m2}</p>
                <p><strong>Tipo de cultivo:</strong> {cultivo.crop_type}</p>
                <p><strong>Ubicación:</strong> {cultivo.location}</p>
                <p><strong>Fecha de inicio:</strong> {cultivo.start_date}</p>
            </div>
        </main>
    );
}