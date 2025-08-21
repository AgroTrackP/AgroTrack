"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function CallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

useEffect(() => {
    const sendCode = async () => {
        const code = searchParams.get("code");
        if (!code) return;

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/auth0/callback`,
                { code }
        );

        // guardás el JWT en localStorage
        localStorage.setItem("token", res.data.jwt);

        // redirigís al dashboard
        router.push("/dashboard");
    } catch (err) {
        console.error("Error en callback:", err);
    }
    };

    sendCode();
}, [searchParams, router]);

return <p className="p-4">Procesando login...</p>;
}