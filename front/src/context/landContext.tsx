/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./authContext";
import { getTerrainsByUser, postTerrainInformation, deactivateTerrain } from "@/services/auth";
import { ApiError } from "next/dist/server/api-utils";
import { toast } from "react-toastify";

// Interfaz para los datos de un terreno
export interface LandData {
  id?: string;
  name: string;
  area_m2: number;
  crop_type: string;
  season: string;
  location: string;
  start_date: string;
  userId?: string; // userId puede ser opcional si el backend lo infiere del token
}

export interface LandUpdateData {
  name?: string;
  area_m2?: number;
  crop_type?: string;
  season?: string;
  location?: string;
  start_date?: string;
}

interface LandContextType {
  createLand: (data: Omit<LandData, "id" | "userId">) => Promise<void>;
  fetchLands: (page?: number, limit?: number) => Promise<void>;
  deleteLand: (id: string) => Promise<void>;
  updateLand: (id: string, data: LandUpdateData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  lands: LandData[];
  totalPages: number;
  totalItems: number;
  currentPageFromApi: number;
}

const LandContext = createContext<LandContextType | undefined>(undefined);

export const LandProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lands, setLands] = useState<LandData[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPageFromApi, setCurrentPageFromApi] = useState(1);

  // ✅ fetchLands ahora solo llama al servicio
  const fetchLands = useCallback(
    async (page: number = 1, limit: number = 5) => {
      if (!user?.id || !token) return;
      setIsLoading(true);
      setError(null);

      try {
        const responseData = await getTerrainsByUser(user.id, token, page, limit);
        setLands(responseData.data || []);
setTotalPages(responseData.totalPages || 0);
setTotalItems(responseData.total ?? 0);
        setCurrentPageFromApi(responseData.currentPage || 1);
      } catch (error) {
        setError("Error al cargar los terrenos paginados.");
        setLands([]);
      } finally {
        setIsLoading(false);
      }
    },
    [user, token]
  );

  const createLand = useCallback(
    async (data: Omit<LandData, "id" | "userId">) => {
      if (!user || !token) return;

      setIsLoading(true);
      try {
        const landDataToApi: LandData = {
  ...data,
  area_m2: typeof data.area_m2 === "string" ? parseFloat(data.area_m2) : data.area_m2,
  userId: user.id!, // <- le decimos a TS que no es undefined
};

        await postTerrainInformation(landDataToApi,token);
        await fetchLands(currentPageFromApi, 5);
      } catch (error) {
        setError("Error al crear el cultivo.");
      } finally {
        setIsLoading(false);
      }
    },
    [user, token, currentPageFromApi, fetchLands]
  );

  // ✅ deleteLand ahora usa deleteTerrain del servicio
  const deleteLand = useCallback(async (landId: string) => {
    if (!token) {
      toast.error("No estás autenticado.");
      return;
    }
    try {
      // 1. Llama a la función del servicio para desactivar en el backend
      await deactivateTerrain(landId, token);
      
      toast.success("Terreno desactivado con éxito.");
      
      // 2. Actualiza la UI al instante para que el terreno desaparezca de la lista
      setLands((prevLands) => prevLands.filter((land) => land.id !== landId));

    } catch (err) {
      const errorMessage =
        (err instanceof Error && err.message) ||
        "Error al desactivar el terreno.";
      toast.error(errorMessage);
    }
  }, [token]); // El array de dependencias solo necesita el token

  const updateLand = useCallback(
    async (landId: string, data: LandUpdateData) => {
      if (!user || !token) return;

      setIsLoading(true);
      try {
        const response = await fetch(`https://agrotrack-develop.onrender.com/plantations/${landId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        const updatedLand = await response.json();
        setLands((prev) => prev.map((l) => (l.id === landId ? { ...l, ...updatedLand } : l)));
      } catch (error) {
        setError("Error al actualizar el terreno.");
      } finally {
        setIsLoading(false);
      }
    },
    [user, token]
  );

  useEffect(() => {
    fetchLands(1, 5);
  }, [fetchLands]);

  return (
    <LandContext.Provider
      value={{ lands, createLand, fetchLands, deleteLand, updateLand, isLoading, error, totalPages, totalItems, currentPageFromApi, }}
    >
      {children}
    </LandContext.Provider>
  );
};

export const useLands = () => {
  const context = useContext(LandContext);
  if (!context) throw new Error("useLands debe usarse dentro de un LandProvider");
  return context;
};





