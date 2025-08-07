"use server";
import { RegisterUserDto } from "@/types";
import { axiosApiBack } from "./utils";

const BASE_URL = "https://agrotrack-develop.onrender.com";

export const postRegister = async (data: RegisterUserDto) => {
    try {
        const res = await axiosApiBack.post(`${BASE_URL}/register`, data);

        if (!res.data) {
            console.warn("Invalid post register data format", res.data);
            return {
                message: "Error al registrar el usuario",
                errors: res.data,
            };
        }
        return {
            message: "Usuario registrado correctamente",
        };
        //hdasdj
        // jkasjdkjaskd
        //base url
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.warn("Error fetching post register", e.message);
        }
        return {
            message: "Error al registrar el usuario",
            errors: (e as Error).message || "Error desconocido",
        };
    }
};

// sevicios