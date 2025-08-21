"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { LandDataDTO } from "@/types"; // 👈 asegúrate que este tipo esté definido
import { useAuthContext } from "./authContext";
import { getTerrainsByUser, postTerrainInformation } from "@/services/auth";

// Interfaz para el DTO que la API espera
interface LandDataToApi {
  _id?: string;
  name: string;
  area_m2: number;
  crop_type: string;
  season: string;
  location: string;
  start_date: string;
  userId: string;
}

interface LandContextType {
  createLand: (data: {
    // El formulario envía estos campos
    name: string;
    area_m2: string;
    crop_type: string;
    location: string;
    season: string;
    start_date: string;
  }) => Promise<void>;
  fetchLands: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  lands: LandDataToApi[];
}

const LandContext = createContext<LandContextType | undefined>(undefined);

export const LandProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lands, setLands] = useState<LandDataToApi[]>([]);

  const createLand = async (data: {
    season: string;
    name: string;
    area_m2: string;
    crop_type: string;
    location: string;
    start_date: string;
  }) => {
    if (!user || !token) {
      setError("No hay usuario logueado o token disponible.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("📤 Enviando terreno al backend desde el contexto:", data);
      const landDataToApi: LandDataToApi = {
        season: data.season,
        name: data.name,
        area_m2: parseFloat(data.area_m2), //
        crop_type: data.crop_type,
        location: data.location,
        start_date: data.start_date,
        userId: user.id ?? "", // Usar el ID del usuario logueado o string vacío si es undefined
      };

      const responseData = await postTerrainInformation(landDataToApi);
      console.log("✅ Respuesta backend:", responseData);
      //Actualizar el estado del contexto con los datos de la API
      // await fetchLands();

      setLands((prevLands) => [...prevLands, responseData]);

      console.log("Cultivo creado exitosamente", responseData);
    } catch (err: any) {
      console.error("Error al enviar los datos:", err);
      setError(err.response?.data?.message || "Error al crear el cultivo.");
    } finally {
      setIsLoading(false);
    }
  };
  // 🔹 Obtener terrenos del backend
  const fetchLands = useCallback(async () => {
    console.log ("oscar2")
    if (!user || !token) return;
    setIsLoading(true);

    try {
      if (!user?.id || !token) return;
      console.log ("oscar3")
      const data = await getTerrainsByUser(user.id, token);
      console.log("🌱 Terrenos obtenidos - Contenido:", data);
      setLands(data);
    } catch (err: any) {
      console.error("Error al obtener terrenos:", err);
      setError(err.response?.data?.message || "Error al cargar los terrenos.");
    } finally {
      setIsLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    console.log ("oscar")
    fetchLands();
  }, [user, token, fetchLands]);

  return (
    <LandContext.Provider
      value={{ lands, createLand, fetchLands, isLoading, error }}
    >
      {children}
    </LandContext.Provider>
  );
};

export const useLands = () => {
  const context = useContext(LandContext);
  if (!context) {
    throw new Error("useLands debe usarse dentro de un LandProvider");
  }
  return context;
};

// "use client"

// import { createContext, useContext, useState, ReactNode, useEffect } from "react"
// import { useAuthContext } from "./authContext";
// import axios from "axios";

// interface LandData {
//     nombreCultivo: string;
//     tipoPlantacion: string;
//     temporada: string;
//     areaTerreno: string;
//     fechaPlantacion: number;
//     userId: number;
// }

// interface LandContextType {
//     createLand: (data: Omit<LandData, "userId">) => Promise<void>;
//     isLoading:boolean;
//     error: string | null;
// }

// const LandContext = createContext<LandContextType | undefined>(undefined);

// export const LandProvider = ({ children }: { children: ReactNode }) => {

//     const { user } = useAuthContext();
//     const [isLoading, setIsLoading] = useState(false);
//     const[error, setError] = useState<string | null>(null);

//     const createLand = async (data: Omit<LandData, "userId">) => {
//       if(!user) {
//         setError("No hay usuario logueado. Por favor, inicia sesión.");
//             return;
//       }
//       setIsLoading(true);
//       setError(null);

//       const newLand = { ...data, userId: user.id};

//       try{
//         await axios.post (`https://agrotrack-develop.onrender.com/lands`, newLand) ;
//         console.log("Cultivo creado exitosamente!");
//         } catch (err) {
//             setError("Error al crear el cultivo. Inténtalo de nuevo.");
//             console.error("Error al enviar los datos:", err);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//     return (
//       <LandContext.Provider value={{createLand, isLoading, error}}>
//         {children}
//         </LandContext.Provider>
//     );
//   };

//   export const useLands = () => {
//     const context = useContext(LandContext);
//     if(!context) {
//       throw new Error("useLands debe ser usado dentro de un LandProvider");

//     }
//     return context;
//   }
