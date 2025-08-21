"use client";

import { LoginResponse } from "@/services/utils/types";
import { IUser } from "@/types";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { updateUserCredentials } from "@/services/auth";

type AuthContextType = {
    isAuth: boolean | null;
    user: IUser | null;
    token: string | null;
    login: boolean;
    saveUserData: (data: LoginResponse) => void;
    logoutUser: () => void;
    resetUserData: () => void;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
    updateCredentials: (updatedData: Partial<IUser>) => Promise<void>;
    
};

const AUTH_KEY = "authData";
const AUTH0_FLAG = "auth0Login"; // evita auto-login después de logout

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [login, setLogin] = useState(false);

    const { user: auth0User, isAuthenticated, getAccessTokenSilently, logout } = useAuth0();

    //  Recuperar sesión del localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = localStorage.getItem(AUTH_KEY);
        if (stored) {
            try {
                const data: LoginResponse = JSON.parse(stored);
                setUser(data.user);
                setToken(data.token);
                setLogin(data.login);
                setIsAuth(true);
            } catch (err) {
                console.error("Error parseando datos de sesión:", err);
                localStorage.removeItem(AUTH_KEY);
            }
        } else {
            setIsAuth(false);
        }
    }, []);

    console.log({auth0User, isAuthenticated});

    // ✅ login automático con Auth0 solo si NO hay sesión local
useEffect(() => {
    if (!isAuthenticated || !auth0User) return;

    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) return; // ya hay sesión local, no hacer nada

        const loginWithAuth0 = async () => {
        try {
    // 1️⃣ pedir access token de Auth0
            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
    },
});

    // 2️⃣ intercambiar en tu backend por un JWT propio
    const res = await fetch(`https://agrotrack-develop.onrender.com/auth/auth0/login`, {
        method: "POST", // 👈 ¡Cambia GET a POST!
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
    },
      // 👈 Aquí enviamos los datos del usuario en el cuerpo de la solicitud
    body: JSON.stringify({
        name: auth0User.name,
        email: auth0User.email,
        picture: auth0User.picture,
        auth0Id: auth0User.sub, // 'sub' es el ID único del usuario en Auth0
    }),
    });

console.log(accessToken)
        const data = await res.json()
console.log(data)
            // 3️⃣ guardar datos en localStorage/context
            localStorage.setItem(AUTH0_FLAG, "true");

            saveUserData({
                login: true,
                user: {
                    id:data.user.id,
                    role: data.user.role || "user",
                    name: data.user.name || "",
                    email: data.user.email || "",
                    picture: data.user.imgUrl || auth0User.picture,
                },
                token: accessToken || data.token, // Asegúrate de que tu backend devuelva el token
                // token: accessToken,
            });
        } catch (error) {
            console.error("Error obteniendo token de Auth0:", error);
        }
    };

    loginWithAuth0();
}, [isAuthenticated, auth0User, getAccessTokenSilently]);

    const saveUserData = (data: LoginResponse) => {
        setUser(data.user);
        setToken(data.token);
        setLogin(data.login);
        setIsAuth(true);
        if (typeof window !== "undefined") {
            localStorage.setItem(AUTH_KEY, JSON.stringify(data));
        }
    };

const logoutUser = () => {
    const isAuth0Session = localStorage.getItem(AUTH0_FLAG) === "true";
    resetUserData();
    console.log({isAuth0Session});

  // si la sesión es de Auth0, cerrar también en Auth0
    if (isAuth0Session) {
        logout({
            logoutParams: { returnTo: window.location.origin },
        });
    return;
}
};

    const resetUserData = () => {
        setUser(null);
        setToken(null);
        setLogin(false);
        setIsAuth(false);
        if (typeof window !== "undefined") {
            localStorage.removeItem(AUTH_KEY);
            localStorage.removeItem(AUTH0_FLAG);
        }
    };
    // ✅ Nueva función para actualizar credenciales
    // ✅ Lógica mejorada para `updateCredentials`
    const updateCredentials = useCallback(async (updatedData: Partial<IUser>) => {
        if (!user) {
            console.error("No se puede actualizar, no hay usuario.");
            return;
        }
        console.log("Token a enviar:", token); // ✅ VERIFICA AQUÍ EL TOKEN
        console.log("ID de usuario a actualizar:", user.id); // ✅ VERIFICA EL ID
        
        let tokenToSend = token; // Por defecto, usa el token del estado

        const isAuth0Session = localStorage.getItem(AUTH0_FLAG) === "true";
        if (isAuth0Session) {
            try {
                // Si es Auth0, obtenemos un token fresco
                tokenToSend = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
                    },
                });
            } catch (error) {
                console.error("Error al obtener un token fresco de Auth0:", error);
                throw new Error("No se pudo obtener un token de autenticación válido.");
            }
        }
        
        if (!tokenToSend) {
            console.error("No hay un token válido para la solicitud.");
            throw new Error("No se pudo obtener un token de autenticación válido.");
        }

        try {       
            const responseData = await updateUserCredentials(user.id!, updatedData, tokenToSend);
            
            console.log("Credenciales actualizadas:", responseData);
            
            // Actualiza el estado del usuario en el contexto y localStorage
            setUser(responseData); 
            
        } catch (error) {
            console.error("Error al actualizar las credenciales:", error);
            throw error;
        }
    }, [user, token, getAccessTokenSilently]);


    // Cada vez que `user` cambie, actualizar también el localStorage
    useEffect(() => {
        if (user && token !== null && login !== null) {
            const currentData: LoginResponse = {
                user,
                token,
                login,
            };
            localStorage.setItem(AUTH_KEY, JSON.stringify(currentData));
        }
    }, [user, token, login]);

    return (
        <AuthContext.Provider
            value={{
                isAuth,
                user,
                token,
                login,
                saveUserData,
                logoutUser,
                resetUserData,
                setUser,
                updateCredentials, 
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext debe usarse dentro de un AuthProvider");
    }
    return context;
};
