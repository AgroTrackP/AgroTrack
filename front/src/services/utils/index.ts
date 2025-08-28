"use server";

import axios from "axios";

export const axiosApiBack = axios.create({
	baseURL: "https://agrotrack-develop.onrender.com",
	headers: {
		"Content-Type": "application/json",
	},
});

// 👉 Interceptor para añadir el token JWT en cada request
axiosApiBack.interceptors.request.use(
	(config) => {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem("authData");
			if (stored) {
				try {
					const parsed = JSON.parse(stored);
					if (parsed?.token) {
						config.headers.Authorization = `Bearer ${parsed.token}`;
					}
				} catch (err) {
					console.warn("Error leyendo token del localStorage:", err);
				}
			}
		}
		return config;
	},
	(error) => Promise.reject(error)
);
