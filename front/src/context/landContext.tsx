"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { useAuthContext } from "./authContext";
import axios from "axios";

interface LandData {
    nombreCultivo: string;
    tipoPlantacion: string;
    temporada: string;
    areaTerreno: string;
    fechaPlantacion: number;
    userId: number;
}

interface LandContextType {
    createLand: (data: Omit<LandData, "userId">) => Promise<void>;
    isLoading:boolean;
    error: string | null;
}

const LandContext = createContext<LandContextType | undefined>(undefined);

export const LandProvider = ({ children }: { children: ReactNode }) => {

    const { user } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const[error, setError] = useState<string | null>(null);

    const createLand = async (data: Omit<LandData, "userId">) => {
      if(!user) {
        setError("No hay usuario logueado. Por favor, inicia sesión.");
            return;
      }
      setIsLoading(true);
      setError(null);

      const newLand = { ...data, userId: user.id};

      try{
        await axios.post (`https://agrotrack-develop.onrender.com/lands`, newLand) ;
        console.log("Cultivo creado exitosamente!");
        } catch (err) {
            setError("Error al crear el cultivo. Inténtalo de nuevo.");
            console.error("Error al enviar los datos:", err);
        } finally {
            setIsLoading(false);
        }
    };
    return (
      <LandContext.Provider value={{createLand, isLoading, error}}>
        {children}
        </LandContext.Provider>
    );
  };

  export const useLands = () => {
    const context = useContext(LandContext);
    if(!context) {
      throw new Error("useLands debe ser usado dentro de un LandProvider");

    }
    return context;
  }








































//     useEffect(() =>{
//         const savedLand = localStorage.getItem("landData");
//         if(savedLand) {
//             const parsed = JSON.parse(savedLand);
//             if (parsed.userId && user && parsed.userId === user.id) {
//               setLandState(parsed);
//             }
//         }
//     },[user]);

//     useEffect(() => {
//         if(land) {
//             localStorage.setItem("landData", JSON.stringify(land))
//         }
//     },[land]);

//     const setLand = (data: Omit <LandData, "userId">) => {
//         if(!user) {
//             console.error("No hay usuario logueado");
//             return;
//         }

//         const newLand = { ...data, userId: user!.id!};
//         setLandState(newLand);
//     };

//      return (
//     <LandContext.Provider value={{ land, setLand }}>
//       {children}
//     </LandContext.Provider>
//   );
// };

// export const useLand = () => {
//   const context = useContext(LandContext);
//   if (!context) {
//     throw new Error("useLand must be used within a LandProvider");
//   }
//   return context;
// };
   
