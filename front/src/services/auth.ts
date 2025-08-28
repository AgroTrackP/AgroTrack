"use server";
import { ForgotPasswordDto, IUser, LandDataDTO, LoginUserDto, RegisterUserDto, ResetPasswordDto } from "@/types";
import { axiosApiBack } from "./utils";
import { LoginServiceResponse } from "./utils/types";
import { LoginResponse } from "./utils/types";

export const postTerrainInformation = async (
	data: LandDataDTO,
	token: string
) => {
	try {
		console.log("Payload a enviar:", data);
		const response = await axiosApiBack.post("/plantations", data, {
			headers: {
				Authorization: `Bearer ${token}`, // <-- enviamos token al backend
				"Content-Type": "application/json",
			},
		});
		return response.data;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.error(
			"Error al enviar información del terreno:",
			error.response?.data || error
		);
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

export const getTerrainsByUser = async (
	userId: string,
	token: string,
	page: number = 1,
	limit: number = 5,
	search: string = "" 
) => {
	try {
		const params = new URLSearchParams({
			page: String(page),
			limit: String(limit),
		});
		if (search) {
			params.append("search", search);
		}

		const res = await axiosApiBack.get(
			`/plantations/user/${userId}?${params.toString()}`,
			{ headers: { Authorization: `Bearer ${token}` } }
		);
		return res.data;
	} catch (error) {
		console.error("Error al obtener terrenos por usuario:", error);
		throw error;
	}
};
export const deactivateTerrain = async (landId: string, token: string) => {
	try {
		const res = await axiosApiBack.patch(
			`/plantations/${landId}/deactivate`,
			{}, // El body va vacío, la acción está en la URL
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return res.data;
	} catch (error) {
		console.error("Error al desactivar el terreno:", error);
		throw error;
	}
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

export const postLogin = async (
	data: LoginUserDto
): Promise<LoginServiceResponse> => {
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
	} catch (e: unknown) {
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
	updatedData: Partial<IUser>, // Puedes tipar esto con una interfaz más específica si lo necesitas
	token: string
) => {
	try {
		const response = await axiosApiBack.put(`/users/${userId}`, updatedData, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		console.error("Error al actualizar las credenciales:", error);
		throw error;
	}
};

export async function sendForgotPasswordEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axiosApiBack.post("/auth/forgot-password", { email } as ForgotPasswordDto);
    
    if (response.status === 200) { // Tu backend devuelve 200 OK
      return { success: true, message: "Si el correo electrónico está registrado, se ha enviado un enlace para restablecer la contraseña." };
    } else {
      return { success: false, message: response.data?.message || "Error desconocido al enviar el correo." };
    }
  } catch (error) {
    console.error("Error en Server Action al solicitar recuperación de contraseña:", error);
    throw error;
  }
}

export async function submitNewPasswordWithToken(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    // El backend ahora espera { token, password } en el BODY
    const dataToSend: ResetPasswordDto = { 
      token: token,
      password: newPassword, // ✅ Mapeamos newPassword del frontend a 'password' que espera el backend
    }; 
    // ✅ Apunta al nuevo endpoint de restablecimiento de contraseña
    // ✅ Utiliza el método POST
    const response = await axiosApiBack.post("/auth/reset-password", dataToSend); 

    if (response.status === 200) { 
      return { success: true, message: "Contraseña restablecida exitosamente." };
    } else {
      return { success: false, message: response.data?.message || "Error al restablecer la contraseña." };
    }
  } catch (error) {
    console.error("Error en Server Action al restablecer contraseña con token:", error);
    throw error;
  }
}
