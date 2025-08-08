"use client"

import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation"
import { FaFacebookF } from "react-icons/fa";

export default function LoginForm() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

      const handleSocialLogin = (provider: "google" | "facebook") => {
            window.location.href = `/auth/${provider}`
        }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");

        if (!form.email || !form.password) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        try {
            const res = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Datos incorrectos.");
                return;
            }

            router.push("/home");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError("Error de conexion con el servidor.");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-2xl font-semibold text-center"> Iniciar Sesion</h2>
            {error && <p className="text-red-600 text-sm">{error}</p>}

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
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
                Iniciar Sesión
            </button>

            <div className="flex items-center justify-center">
                <span className="text-gray-500 text-sm">o continúa con</span>
            </div>

            <div className="flex flex-col space-y-2">
                <button type="button"
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded hover:bg-gray-100 transition"
                    onClick={() => handleSocialLogin("google")}
                >
                    <a><FaGoogle /></a>
                    Continuar con Google
                </button>

                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded hover:bg-gray-100 transition"
                    onClick={() => handleSocialLogin("facebook")}
                >
                    <a> <FaFacebookF /></a>
                    Continuar con Facebook
                </button>
            </div>
        </form>
    );
}

//comentario de prueba