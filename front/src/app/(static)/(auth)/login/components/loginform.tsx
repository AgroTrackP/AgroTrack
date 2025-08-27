"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/authContext";
import { postLogin } from "@/services/auth";
import { routes } from "@/routes";
import { toast } from "react-toastify";
import * as yup from "yup";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import { Loader2 } from "lucide-react"; // Ícono de carga
import Link from "next/link";

const loginSchema = yup.object({
    email: yup
        .string()
        .required("El correo electrónico es obligatorio")
        .email("El correo electrónico no es válido"),
    password: yup
        .string()
        .min(6, "La contraseña debe tener al menos 8 caracteres")
        .max(15, "La contraseña no puede superar los 32 caracteres")
        .required("La contraseña es obligatoria")
        .matches(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
        .matches(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
        .matches(/\d/, "La contraseña debe contener al menos un número")
        .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "La contraseña debe contener al menos un carácter especial"),
});


export default function LoginForm() {
    const { saveUserData } = useAuthContext();
    const router = useRouter();
    const { loginWithRedirect } = useAuth0();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);

    const handleValidation = async () => {
        try {
            await loginSchema.validate(form, { abortEarly: false });
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const newErrors: Record<string, string> = {};
                error.inner.forEach((curr) => {
                    if (curr.path) {
                        newErrors[curr.path] = curr.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValid = await handleValidation();
        if (!isValid) return;
        
        setLoading(true);
        setErrors({});

        try {
            const res = await postLogin(form);
            const data = res.data;

            if (!data?.token || !data?.user) {
                toast.error(data?.message || "Datos incorrectos");
                setLoading(false);
                return;
            }

            saveUserData(data);
            toast.success("¡Bienvenido! Redirigiendo a tu perfil...");

            setTimeout(() => {
                router.push(routes.profile)
            }, 2000);

        } catch (error) {
            toast.error("Error al iniciar sesión. Por favor, verifica tus credenciales.");
            console.error("Error de inicio de sesión:", error);
            setLoading(false);
        }
    };

     return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-11 rounded-xl shadow-lg space-y-8 relative"
    >
      {/* --- Overlay de Carga --- */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center rounded-xl z-10">
          <Loader2 className="animate-spin h-10 w-10 text-green-600" />
          <p className="mt-4 text-gray-600">Iniciando sesión...</p>
        </div>
      )}
      
      <h2 className="text-2xl font-semibold text-center"> Iniciar Sesión</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Correo electrónico</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg"
          required
        />
        {errors?.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Contraseña</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors?.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
      </div>
      
      <button
        disabled={loading}
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-green-700 disabled:opacity-50 disabled:cursor-wait"
      >
        Iniciar Sesión
      </button>

      <p className="text-center text-sm text-gray-600">
        ¿No tienes una cuenta?{" "}
        <Link href={routes.register} className="text-green-600 hover:underline font-medium">
          Regístrate aquí
        </Link>
      </p>

      <div className="relative flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-sm">o</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <button type="button" 
        onClick={() => loginWithRedirect()}
        disabled={loading}
        className="w-full py-2 px-4 rounded-md border border-gray-300 text-gray-700 flex items-center justify-center space-x-2 shadow-sm hover:bg-gray-50 transition disabled:opacity-50">
        <FaGoogle className="text-lg" />
        <span>Continuar con Google</span>
      </button>

      {/* --- ENLACE AÑADIDO AQUÍ --- */}
      <p className="text-center text-sm text-neutral-500">
        <Link href={routes.home} className="text-gray-600 hover:text-green-700 hover:underline">
          ‹ Volver al inicio
        </Link>
      </p>
    </form>
  );
}