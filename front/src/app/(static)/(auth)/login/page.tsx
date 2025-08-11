// import Link from "next/link";
import LoginForm from "./components/loginform";
import React from "react";

export default function LoginPage () {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
            <LoginForm/>
            {/* <p className="text-center text-sm text-neutral-500 mt-3">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
                Regístrate
            </Link> 
        </p>   */}
        </main>
    );
}
