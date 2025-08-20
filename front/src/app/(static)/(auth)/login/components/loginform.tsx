"use client";

import React, { useState } from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/authContext";
import { postLogin } from "@/services/auth";
import { routes } from "@/routes";
import { toast } from "react-toastify";
import * as yup from "yup";
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
    const {saveUserData} = useAuthContext();
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

    const handleSocialLogin = (provider: "google" | "facebook") => {
        window.location.href = `/auth/${provider}`; // Redirige al endpoint de autenticación social
        };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        // Evita el comportamiento por defecto del formulario
        e.preventDefault();
        const isValid = await handleValidation();
        if (!isValid) return;

    try {
        setLoading(true);
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
                
                if (res.data) {
                saveUserData(res.data);
};
                //guardar el token en localStorage o cookies
                
                toast.success(" Inició de sesión exitoso");

        // redireccionar a la pagina de inicio o dashboard
        setTimeout (()=>{
            router.push(routes.home)
        },2000);

// (error:unknown)
    } catch {
        toast.error("Error al iniciar sesión");
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
                    className="w-full border px-3 py-2 rounded"
                    required
                />
            </div>

             <div>
                <label className="block text-sm font-medium mb-1">Contraseña</label>
                <input
                    
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
            </div>
            {errors?.password && <p className="text-red-600 text-sm">{errors.password}</p>}
            <button
                disabled={loading}
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
                Iniciar Sesión
            </button>

    <div className="flex items-center justify-center">
        <span className="text-gray-500 text-sm">o continúa con</span>
    </div>

    <div className="flex flex-col space-y-2">
        <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded hover:bg-gray-100 transition"
            onClick={() => handleSocialLogin("google")}
        >
            <FaGoogle /> Continuar con Google
        </button>

        <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded hover:bg-gray-100 transition"
            onClick={() => handleSocialLogin("facebook")}
        >
            <FaFacebookF /> Continuar con Facebook
        </button>

        <hr />
        <button type="button" onClick={() => loginWithRedirect()}>
            Iniciar sesión con Auth0
        </button>
    </div>
    </form>
);
}
