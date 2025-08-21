"use client";

import { LoginResponse } from "@/services/utils/types";
import { IUser, IUSerSuscription } from "@/types";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { updateUserCredentials } from "@/services/auth";
import { axiosApiBack } from "@/services/utils";

type AuthContextType = {
    isAuth: boolean | null;
    user: IUser | null;
    token: string | null;
    login: boolean;
    subscription: IUSerSuscription | null;
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
    const [subscription, setSubscription] = useState<IUSerSuscription | null>(null);

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
    useEffect(() => {
        if (isAuth && user && token) {
            const fetchSubscription = async () => {
                try {
                    // ✅ La URL de tu endpoint de suscripciones
                    const response = await axiosApiBack.get(`/subscriptions/${user.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.data && response.data.subscription) {
                        setSubscription(response.data.subscription);
                    } else {
                        setSubscription(null);
                    }
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

    // Bloque de código para cuando esté el endpoint
    // const [subscription, setSubscription] = useState<IUSerSuscription | null>(null);

    // useEffect(() => {
    //     if (isAuth && user && token) {
    //         const fetchSubscription = async () => {
    //             try {
    //                 const response = await axiosApiBack.get(`/subscriptions/${user.id}`, {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`,
    //                     },
    //                 });

    //                 if (response.data && response.data.subscription) {
    //                     setSubscription(response.data.subscription);
    //                 } else {
    //                     setSubscription(null);
    //                 }
    //             } catch (error) {
    //                 console.error("Error al cargar la suscripción:", error);
    //                 setSubscription(null);
    //             }
    //         };
    //         fetchSubscription();
    //     }
    // }, [isAuth, user, token]);