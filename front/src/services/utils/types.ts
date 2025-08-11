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
}



// interface User {
//     id: number;
//     name: string;
//     email: string;
//     role: "user" | "admin" | string;
//     credential: Credential;
// }

// interface Credential {
//     id: number;
//     password: string;
// }