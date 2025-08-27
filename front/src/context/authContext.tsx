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
    subscription: IUserSubscription | null;
    loadingSubscription: boolean;
    saveUserData: (data: LoginResponse) => void;
    logoutUser: () => void;
    resetUserData: () => void;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
    updateCredentials: (updatedData: Partial<IUser>) => Promise<void>;
    refetchSubscription: () => Promise<void>;
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
    useEffect(() => {
        if (!isAuthenticated || !auth0User) return;
        const stored = localStorage.getItem(AUTH_KEY);
        if (stored) return; // Ya hay una sesión local, no hacer nada

        const loginWithAuth0 = async () => {
            try {
                const accessToken = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
                    },
                });

                const res = await fetch(`https://agrotrack-develop.onrender.com/auth/auth0/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
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
                    token: data.token,
                });
            } catch (error) {
                console.error("Error obteniendo token de Auth0 o autenticando con backend:", error);
            }
        };
        loginWithAuth0();
    }, [isAuthenticated, auth0User, getAccessTokenSilently]);

    // 3. Lógica para cargar la suscripción del usuario
    const refetchSubscription = useCallback(async () => {
        if (isAuth && user && token) {
            setLoadingSubscription(true);
            try {
                const apiUrl = `/api/users/subscription-plan/${user.id}`;
                const response = await fetch(apiUrl, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'No se pudo cargar la información del plan.');
                }
                setSubscription(data);
            } catch (error) {
                console.error("Error al cargar la suscripción:", error);
                setSubscription(null);
            } finally {
                setLoadingSubscription(false);
            }
        }
    }, [isAuth, user, token]);

    useEffect(() => {
        if (isAuth) {
            refetchSubscription();
        }
    }, [isAuth, refetchSubscription]);

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

    const updateCredentials = useCallback(async (updatedData: Partial<IUser>) => {
        if (!user || !token) {
            throw new Error("No se puede actualizar, no hay usuario o token.");
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
            } catch {
                throw new Error("No se pudo obtener un token de autenticación válido.");
            }
        }
        try {
            const responseData = await updateUserCredentials(user.id!, updatedData, tokenToSend);
            setUser((prev) => prev ? { ...prev, ...responseData.user} as IUser : responseData.user as IUser);
        } catch (error) {
            console.error("Error al actualizar las credenciales:", error);
            throw error;
        }
    }, [user, token, getAccessTokenSilently]);

    useEffect(() => {
        if (user && token !== null && login !== null) {
            const currentData: LoginResponse = { user, token, login };
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
                refetchSubscription,
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