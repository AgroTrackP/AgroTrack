import { IUser } from "@/types";

export interface LoginServiceResponse{
    message: string;
    data?: LoginResponse;
    errors?: unknown; // puedes ajustar el tipo segun lo que esperes de los errores
}

export interface LoginResponse {
    login: boolean;
    user: IUser;
    token: string;
    message?: string;
    provider?: "local" | "auth0";
}

export interface LandServiceResponse{
    message: string;
    data?: object;
    errors?: Record<string, never>; 
}

