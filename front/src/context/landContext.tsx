"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface LandData {
    name: string;
    location: string;
    size: string;
    description: string;
}

interface LandContextType {
    land: LandData | null;
    setLand: (data: LandData) => void;
}

const LandContext = createContext<LandContextType | undefined>(undefined);

export const LandProvider = ({ children }: { children: ReactNode }) => {

    const [land, setLandState] = useState<LandData | null>(null);

    const setLand = (data: LandData) => {
        setLandState(data);
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