"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { useAuthContext } from "./authContext";

interface LandData {
    name: string;
    location: string;
    size: string;
    description: string;
    userId: number;
}

interface LandContextType {
    land: LandData | null;
    setLand: (data: Omit<LandData, "userId">) => void;
}

const LandContext = createContext<LandContextType | undefined>(undefined);

export const LandProvider = ({ children }: { children: ReactNode }) => {

    const { user } = useAuthContext();
    const [land, setLandState] = useState<LandData | null>(null);

    useEffect(() =>{
        const savedLand = localStorage.getItem("landData");
        if(savedLand) {
            const parsed = JSON.parse(savedLand);
            if (parsed.userId && user && parsed.userId === user.id) {
              setLandState(parsed);
            }
        }
    },[user]);

    useEffect(() => {
        if(land) {
            localStorage.setItem("landData", JSON.stringify(land))
        }
    },[land]);

    const setLand = (data: Omit <LandData, "userId">) => {
        if(!user) {
            console.error("No hay usuario logueado");
            return;
        }

        const newLand = { ...data, userId: user!.id!};
        setLandState(newLand);
    };

     return (
    <LandContext.Provider value={{ land, setLand }}>
      {children}
    </LandContext.Provider>
  );
};

export const useLand = () => {
  const context = useContext(LandContext);
  if (!context) {
    throw new Error("useLand must be used within a LandProvider");
  }
  return context;
};
   
