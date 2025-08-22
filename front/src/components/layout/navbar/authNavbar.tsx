"use client";

import Button from "@/components/ui/button";
// import Loader from "@/components/ui/loader/loader";
import { useAuthContext } from "@/context/authContext";
import { routes } from "@/routes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { FaRegUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { SiTerraform } from "react-icons/si";

export const AuthNavbar = () => {
    const {isAuth, logoutUser} = useAuthContext();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const pathname = usePathname();
    const router = useRouter();
    // const isAuthenticated = false;

    const user = {
    id: 1,
    name: "",
    email: "",
    role: "",
    // id: 1,
    // name: "Carlos Pérez",
    // email: "carlos.perez@example.com",
    // role: "user",
    
};

const logout = () => {
    logoutUser();   
    router.push(routes.home);

};
if (isAuth === null) {
    // return <Loader/>;
}


    //lo que se muestra si el usuario no esta autentificado
    // para que no sea mas harcodeado cambiar a (!isAuth) y eliminar const isAuthenticated = true;
    if (!isAuth) {  
        return (
        <div>
            <Link href={routes.login}>
            <Button
                label="Iniciar Sesion"
                variant='outline'
        />
        </Link>
            <Link href={routes.register}>
            <Button
                label="Registrarse"
                variant='outline'
        />
        </Link>
        </div>
    );
}    
//lo que se muestra si el usuario si esta autentificado
    return (
        <div className="flex items-center space-x-9 rtl:space-x-reverse">
        <Link href={routes.profile} className='flex items-center space-x-2 rtl:space-x-reverse'>
            <FaRegUser  className="h-5 w-5 text-gray-500" />
        <span className='cursor-pointer font-medium'> {user.name}</span>
        </Link>
        <Link href={routes.page} className='flex items-center space-x-2 rtl:space-x-reverse'>
            <SiTerraform  className="h-5 w-5 text-gray-500" />
        <span className='cursor-pointer font-medium'>Agregar cultivos</span>
        </Link>
        <div onClick={logout} className="cursor-pointer">
            <MdLogout className="h-5 w-5 text-gray-500" />
        </div>
    </div>
    )
};


export default AuthNavbar;
