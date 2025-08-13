"use client";

import { LoginResponse } from "@/services/utils/types";
import { IUser } from "@/types";
import { createContext } from "react";
import { useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

type AuthContextType = {
    isAuth: boolean | null;
    user: IUser | null;
    token: string | null;
    login: boolean;
    saveUserData: (data: LoginResponse) => void;
    logoutUser: () => void;
    resetUserData: () => void;
};

const AUTH_KEY = "authData";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [login, setLogin] = useState(false);

    const { user: auth0User, isAuthenticated, getAccessTokenSilently, logout } = useAuth0();

  // Recuperar sesión del localStorage en cliente
    useEffect(() => {
       if (typeof window === "undefined") return; // Evita SSR
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

  // Login automático con Auth0
useEffect(() => {
    if (!isAuthenticated || !auth0User) return;
    const loginWithAuth0 = async () => {
        try {
            const accessToken = await getAccessTokenSilently();
            saveUserData({
                login: true,
                user: {
            name: auth0User.name || "",
            email: auth0User.email || "",
            picture: auth0User.picture || "",
        },
        token: accessToken,
        });
    } catch (error) {
        console.error("Error obteniendo token de Auth0:", error);
    }
    };
    loginWithAuth0();
}, [isAuthenticated, auth0User]);

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
    resetUserData();
    logout({ logoutParams: { returnTo: typeof window !== "undefined" ? window.location.origin : "/" } });
};

const resetUserData = () => {
    setUser(null);
    setToken(null);
    setLogin(false);
    setIsAuth(false);
    if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_KEY);
    }
};

return (
    <AuthContext.Provider value={{ isAuth, user, token, login, saveUserData, logoutUser, resetUserData }}>
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