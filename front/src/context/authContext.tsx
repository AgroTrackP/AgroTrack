"use client";

import { LoginResponse } from "@/services/utils/types";
import { IUser, IUserSubscription } from "@/types";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { updateUserCredentials } from "@/services/auth";

type AuthContextType = {
    isAuth: boolean | null;
    user: IUser | null;
    token: string | null;
    login: boolean;
    subscription: IUserSubscription  | null;
    loadingSubscription: boolean;
    saveUserData: (data: LoginResponse) => void;
    logoutUser: () => void;
    resetUserData: () => void;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
    updateCredentials: (updatedData: Partial<IUser>) => Promise<void>;
};

const AUTH_KEY = "authData";
const AUTH0_FLAG = "auth0Login";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [login, setLogin] = useState(false);
    const [subscription, setSubscription] = useState<IUserSubscription | null>(null);
    const [loadingSubscription, setLoadingSubscription] = useState(true);

    const { user: auth0User, isAuthenticated, getAccessTokenSilently, logout } = useAuth0();

    // 1. Recuperar la sesión del localStorage
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

    // 2. Lógica para manejar el inicio de sesión con Auth0 


    console.log({ auth0User, isAuthenticated });

    // ✅ login automático con Auth0 solo si NO hay sesión local
    useEffect(() => {
        if (!isAuthenticated || !auth0User) return;
        const stored = localStorage.getItem(AUTH_KEY);
        if (stored) return; // Ya hay una sesión local, no hacer nada

        const loginWithAuth0 = async () => {
            try {
                // Obtener el access token de Auth0
                const accessToken = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
                    },
                });

                // Intercambiar en tu backend por un JWT propio
                const res = await fetch(`https://agrotrack-develop.onrender.com/auth/auth0/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`, // ✅ Sintaxis corregida
                    },
                    body: JSON.stringify({
                        name: auth0User.name,
                        email: auth0User.email,
                        picture: auth0User.picture,
                        auth0Id: auth0User.sub,
                    }),
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || "Error al autenticar con el backend");
                }

                localStorage.setItem(AUTH0_FLAG, "true");
                saveUserData({
                    login: true,
                    user: {
                        id: data.user.id,
                        role: data.user.role || "user",
                        name: data.user.name || "",
                        email: data.user.email || "",
                        picture: data.user.imgUrl || auth0User.picture,
                    },
                    token: data.token, // ✅ Usar el token del backend, no el de Auth0
                });

            } catch (error) {
                console.error("Error obteniendo token de Auth0 o autenticando con backend:", error);
            }
        };

        loginWithAuth0();
    }, [isAuthenticated, auth0User, getAccessTokenSilently]);

    // 3. Lógica para cargar la suscripción del usuario
    // bloque de suscripcion
    useEffect(() => {
        if (isAuth && user && token) {
            const fetchSubscription = async () => {
                try {
                    const apiUrl = `/api/users/subscription-plan/${user.id}`;
                    const response = await fetch(apiUrl, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (!response.ok) {
                        if (response.status === 404) {
                            console.log("El usuario no tiene una suscripción activa.");
                            setSubscription(null);
                            return;
                        }
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'No se pudo cargar la información del plan.');
                    }
                    const data = await response.json();
                    console.log("Suscripción cargada con éxito:", data);
                    setSubscription(data);
    
                } catch (error) {
                    console.error("Error al cargar la suscripción:", error);
                    setSubscription(null);
                }
            };
    
            fetchSubscription();
        }
    }, [isAuth, user, token]);

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
        if (isAuth0Session) {
            logout({
                logoutParams: { returnTo: window.location.origin },
            });
        }
    };

    const resetUserData = () => {
        setUser(null);
        setToken(null);
        setLogin(false);
        setIsAuth(false);
        setSubscription(null);
        if (typeof window !== "undefined") {
            localStorage.removeItem(AUTH_KEY);
            localStorage.removeItem(AUTH0_FLAG);
        }
    };

    // 4. Función para actualizar credenciales, manejando Auth0 y login normal
    const updateCredentials = useCallback(async (updatedData: Partial<IUser>) => {
        if (!user) {
            console.error("No se puede actualizar, no hay usuario.");
            return;
        }
        
        let tokenToSend = token; 

        const isAuth0Session = localStorage.getItem(AUTH0_FLAG) === "true";
        if (isAuth0Session) {
            try {
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
            setUser(responseData); 
        } catch (error) {
            console.error("Error al actualizar las credenciales:", error);
            throw error;
        }
    }, [user, token, getAccessTokenSilently]);

    // 5. Sincronizar el localStorage con los cambios de estado
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
                subscription,
                loadingSubscription,
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