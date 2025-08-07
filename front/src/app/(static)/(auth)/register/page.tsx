import Link from "next/link";
import RegisterForm from "./components/registerForm";

export default function RegisterPage (){
return (
        <div>
        <h2 className="text-1xl font-bold text-neutral-600 text-center my-3">
        Crear cuenta
        </h2>
        <RegisterForm/>
        <p className="text-center text-sm text-neutral-500 mt-3">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
                Inicia sesión
            </Link> 
        </p>  
        </div>
);
}