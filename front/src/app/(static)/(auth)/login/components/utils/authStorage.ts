const TOKEN_KEY = "token";
const USER_KEY = "user";

export const authStorage = {
    setSession: (token: string, user: unknown) => {
        if(typeof window !== "undefined") {
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
    },

    getToken: (): string | null => {
        if(typeof window === "undefined") return null;
        return localStorage.getItem(TOKEN_KEY)
    },

    getUser: (): unknown | null => {
        if(typeof window === "undefined") return null;
        const stored = localStorage.getItem(USER_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    clearSession: () => {
        if(typeof window !== "undefined") {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        }
    },
} ;