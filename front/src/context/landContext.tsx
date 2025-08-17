
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useAuthContext } from "./authContext";

interface LandData {
  nombreCultivo: string;
  tipoPlantacion: string;
  temporada: string;
  areaTerreno: string;
  fechaPlantacion: string; 
  latitud: number | null;
  longitud: number | null;
  userId: number;
}

interface LandContextType {
  createLand: (data: Omit<LandData, "userId">) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  lands: LandData[];
}

const LandContext = createContext<LandContextType | undefined>(undefined);

export const LandProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lands, setLands] = useState<LandData[]>([]);

  const createLand = async (data: Omit<LandData, "userId">) => {
    if (!user) {
      setError("No hay usuario logueado. Por favor, inicia sesión.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const newLand = { ...data, userId: user.id };

    try {
      
      await new Promise((resolve) => setTimeout(resolve, 2000)); 

      console.log("Datos que serían enviados al backend:");
      console.log(newLand);


      setLands((prevLands) => [...prevLands, newLand as LandData]);

     
      
      console.log("Cultivo creado exitosamente ");
    } catch (err) {
      setError("Error al crear el cultivo. Inténtalo de nuevo.");
      console.error("Error al enviar los datos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LandContext.Provider value={{ createLand, isLoading, error, lands }}>
      {children}
    </LandContext.Provider>
  );
};

export const useLands = () => {
  const context = useContext(LandContext);
  if (!context) {
    throw new Error("useLands debe ser usado dentro de un LandProvider");
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







































