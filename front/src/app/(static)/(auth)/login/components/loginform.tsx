"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/authContext";
import { postLogin } from "@/services/auth";
import { routes } from "@/routes";
import { toast } from "react-toastify";
import * as yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { SiAuth0 } from "react-icons/si";

const loginSchema = yup.object({
    email: yup
        .string()
        .required("El correo electrónico es obligatorio")
        .email("El correo electrónico no es válido"),
    password: yup
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .required("La contraseña es obligatoria")
        .matches(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
        .matches(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
        .matches(/\d/, "La contraseña debe contener al menos un número")
        .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "La contraseña debe contener al menos un carácter especial"),
});


export default function LoginForm() {
    const { saveUserData } = useAuthContext();
    const router = useRouter();

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
        // Evita el comportamiento por defecto del formulario
        e.preventDefault();
        const isValid = await handleValidation();
        if (!isValid) return;
        setLoading(true);

        try {
            const res = await postLogin(form);
            const data = res.data;

            if (!data?.token || !data?.user) {
                toast.error(data?.message || "Datos incorrectos");
                return;
            }

            console.log("Datos de inicio de sesión:", data);
            // Guardar token y usuario
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Actualiza el contexto global

            saveUserData(data);

            //guardar el token en localStorage o cookies

            toast.success(" Inició de sesión exitoso");


            // redireccionar a la pagina de inicio o dashboard
            setTimeout(() => {
                router.push(routes.profile)
            }, 2000);

            // (error:unknown)
        } catch (error) {
            toast.error("Error al iniciar sesión");
            console.error("Error de inicio de sesión:", error);

        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    };

    function loginWithRedirect(): void {
        throw new Error("Function not implemented.");
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white p-11 rounded shadow space-y-8">
            <h2 className="text-2xl font-semibold text-center"> Iniciar Sesion</h2>


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
                        className="absolute inset-y-0 right-0  flex items-center justify-center w-10 h-10 bg-green-500 rounded-tr-lg rounded-br-lg rounded-l-none text-white"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>
            {errors?.password && <p className="text-red-600 text-sm">{errors.password}</p>}
            <button
                disabled={loading}
                type="submit"
                className="w-full bg-white text-green-600 py-2 px-4 rounded-lg border border-green-600 transition-colors duration-300 hover:bg-green-600 hover:text-white"
            >
                Iniciar Sesión
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
                ¿No tienes una cuenta?{" "}
                <a href={routes.register} className="text-blue-600 hover:underline">
                    Regístrate aquí
                </a>
            </p>
            <div className="flex items-center justify-center">
                <span className="text-gray-500 text-sm">o continúa con</span>
            </div>

            <div className="flex flex-col space-y-2">

                <hr />
                <button type="button" onClick={() => loginWithRedirect()}
                    className="w-full py-2 px-4 rounded-md border border-gray-300 text-gray-700 flex items-center justify-center space-x-2 shadow-sm hover:bg-gray-50 transition">
                    <SiAuth0 className="text-xl" />
                    Iniciar sesión con Auth0
                </button>
            </div>
        </form>
    );
}
