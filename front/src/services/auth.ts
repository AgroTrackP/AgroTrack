"use server";
import { LandDataDTO, LoginUserDto, RegisterUserDto } from "@/types";
import { axiosApiBack } from "./utils";
import { LoginServiceResponse } from "./utils/types";
import { LoginResponse } from "./utils/types";

export const postTerrainInformation = async (data: LandDataDTO) => {
  try {
    console.log("Payload a enviar:", data);
    const response = await axiosApiBack.post("/plantations", data);
    return response.data;
  } catch (error) {
    console.error("Error al enviar información del terreno:", error);
    throw error;
  }
};
export const getTerrains = async () => {
  try {
    const res = await axiosApiBack.get("/plantations");
    return res.data;
  } catch (error) {
    console.error("Error al obtener terrenos:", error);
    throw error;
  }
};

export const getTerrainsByUser = async (userId: string, token: string) => {
  
  const res = await axiosApiBack.get(`/plantations/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log (res.data)
  return res.data;
  
};

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

export const postLogin = async (data:LoginUserDto): Promise<LoginServiceResponse> => {
    try {
        const res = await axiosApiBack.post<LoginResponse>("/auth/login", data); 

        if (!res.data) {
            console.warn("Invalid post login data format", res.data);
            return {
                message: "Error al iniciar sesión",
                errors: res.data,
            };
        }

        return {
            message: "Usuario inició sesión correctamente",
            data: res.data,
        };       
    } catch (e:unknown) {
        if (e instanceof Error) {
            console.warn("Error fetching post login", e?.message);
        }
        return {
            message: "Error al iniciar sesión",
            errors: (e as Error).message || "Error desconocido",
        };
    }
};

export const updateUserCredentials = async (
  userId: string,
  updatedData: any, // Puedes tipar esto con una interfaz más específica si lo necesitas
  token: string
) => {
  try {
    const response = await axiosApiBack.put(`/users/${userId}`, updatedData, {
      headers: 
      { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar las credenciales:", error);
    throw error;
  }
};


