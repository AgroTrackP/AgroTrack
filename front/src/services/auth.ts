"use server";
import { RegisterUserDto } from "@/types";
import { axiosApiBack } from "./utils";

export const postRegister = async (data: RegisterUserDto) => {
  console.log("Enviando datos de registro:", data);

  try {
    const response = await axiosApiBack.post("/auth/register", data);

    console.log("Respuesta del backend:", response.data);

    if (response.status !== 201 && response.status !== 200) {
      return {
        message: "Error al registrar el usuario",
        errors: response.data || "Respuesta no válida del servidor",
      };
    }

    return {
      message: "Usuario registrado correctamente",
      data: response.data,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.warn("Error en postRegister:", error.message);
      return {
        message: "Error al registrar el usuario",
        errors: error.message,
      };
    }
    console.warn("Error en postRegister:", error);
    return {
      message: "Error al registrar el usuario",
      errors: "Error desconocido",
    };
  }
};
