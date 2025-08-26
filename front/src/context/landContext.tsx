"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./authContext";
import { getTerrainsByUser, postTerrainInformation } from "@/services/auth";

// Interfaz para el DTO que la API espera
interface LandDataToApi {
  id?: string;
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

type ApiError = Error & {
  response?: {
    data?: {
      message?: string;
    };
  };
};

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
        area_m2: parseFloat(data.area_m2),
        crop_type: data.crop_type,
        location: data.location,
        start_date: data.start_date,
        userId: user.id ?? "",
      };

      const responseData = await postTerrainInformation(landDataToApi);
      console.log("✅ Respuesta backend:", responseData);

      setLands((prevLands) => [...prevLands, responseData]);

      console.log("Cultivo creado exitosamente", responseData);
    } catch (err) {
      const apiError = err as ApiError;
      console.error("Error al enviar los datos:", apiError);
      setError(apiError.response?.data?.message || "Error al crear el cultivo.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLands = useCallback(async () => {
    if (!user || !token) return;
    setIsLoading(true);

    try {
      if (!user?.id || !token) return;

      const data = await getTerrainsByUser(user.id, token);
      console.log("🌱 Terrenos obtenidos - Contenido:", data);
      const terrains = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.terrains)
          ? (data as any).terrains
          : Array.isArray((data as any)?.data)
            ? (data as any).data
            : [];

      setLands(terrains);
    } catch (err) {
      const apiError = err as ApiError;
      console.error("Error al obtener terrenos:", apiError);
      setError(apiError.response?.data?.message || "Error al cargar los terrenos.");
    } finally {
      setIsLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
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



