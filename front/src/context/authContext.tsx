"use client";

import { LoginResponse } from "@/services/utils/types";
import { IUser } from "@/types";
import { createContext, useContext, useState } from "react";

type AuthContextType = {
    // state to manage authentication
    isAuth: boolean | null;
    user: IUser | null;
    token: string | null;

    saveUserData: (data:LoginResponse) => void;
    resetUserData:()=> void;
    
};
const AUTH_KEY = "authData";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string | null>(null);

    

    //Actions
    
// const defaultData: LoginResponse = {
//   login: true, // valor hardcodeado para simular que está logueado
//   user: {
//     id: "123",
//     name: "Juan Pérez",
//     email: "juan@example.com",
//     // agrega aquí las demás propiedades que tenga tu IUser
//   },
//   token: "token-hardcodeado-123456",
//   message: "Sesión iniciada correctamente (hardcodeada)",
// };

//       useEffect(() => {
//     const storedData = localStorage.getItem(AUTH_KEY);
//     if (storedData) {
//       const parsed = JSON.parse(storedData) as LoginResponse;
//       setUser(parsed.user);
//       setToken(parsed.token);
//       setIsAuth(true);
//     } else {
//       // Usa datos por defecto
//       saveUserData(defaultData);
//     }
//   }, []);

    const saveUserData = (data:LoginResponse) => {
        setUser(data.user);
        setToken(data.token);
        setIsAuth(true);
        //guardar los datos del contexto en el local storage
            localStorage.setItem(
            AUTH_KEY,
            JSON.stringify(data)
        );
}
    const resetUserData = () => {
        setUser(null);
        setToken(null);
        setIsAuth(false);
                //ELIMINAR los datos del contexto desde el local storage
        localStorage.removeItem(AUTH_KEY);
    }


    return <AuthContext.Provider value={{isAuth, user, token, saveUserData , resetUserData}}>
        {children}
        </AuthContext.Provider>;
};

// custom hook
export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
    throw new Error("useAuthContext debe usarse dentro de un AuthProvider");
}

return context;
};