"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/authContext";


export default function LandForm({ 
    coords
}: { 
    coords: string
}) {
    const { user } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login"); 
        }
    }, [user, router]);


    const [form, setForm] = useState({

        name: "",
        area_m2: "",
        crop_type: "",
        location: "",
        start_date: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if(coords) {
            setForm((prev) => ({ ...prev, location: coords}));
        }
    }, [coords]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!form.name || !form.area_m2 || !form.crop_type || !form.location || !form.start_date) {
            setError("Todos los campos son obligatorios");
            return;
        }
        try {
            const res = await fetch("https://agrotrack-develop.onrender.com/plantations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                setError("Error al guardar el terreno.");
                return;
            }
            setSuccess("Terreno reservado correctamente.");
            setForm({
                name: "",
                area_m2: "",
                crop_type: "",
                location: "",
                start_date: "",
            });
        } catch (err) {
            console.error("Detalle del error:", err);
            setError("Error en la conexión con el servidor")
        }
    };

    if (!user) {
        return null; 
    }
    
    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4"
        >
            <h2 className="text-2xl font-semibold text-center">Registrar Terreno</h2>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre del terreno</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
            </div>

            <div>
                <label htmlFor="area_m2" className="block text-sm font-medium mb-1">Área (m²)</label>
                <input
                    type="number"
                    id="area_m2"
                    name="area_m2"
                    step="0.01"
                    value={form.area_m2}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
            </div>

            <div>
                <label htmlFor="crop_type" className="block text-sm font-medium mb-1">Tipo de cultivo</label>
                <input
                    type="text"
                    id="crop_type"
                    name="crop_type"
                    value={form.crop_type}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
            </div>

            <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">Ubicación</label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
            </div>

            <div>
                <label htmlFor="start_date" className="block text-sm font-medium mb-1">Fecha de inicio</label>
                <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
                Guardar Terreno
            </button>
        </form>
    )
}