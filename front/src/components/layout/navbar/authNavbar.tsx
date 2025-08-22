"use client";

import Button from "@/components/ui/button";
import { useAuthContext } from "@/context/authContext";
import { routes } from "@/routes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { FaRegUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { SiTerraform } from "react-icons/si";

export const AuthNavbar = () => {
    // 1. Obtenemos el 'user' real del contexto, además de 'isAuth' y 'logoutUser'
    const { isAuth, logoutUser, user } = useAuthContext();
    const pathname = usePathname();
    const router = useRouter();


    const logout = () => {
        logoutUser();   
        router.push(routes.home);
    };

    if (isAuth === null) {
    }

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
    
    return (
        <div className="flex items-center space-x-9 rtl:space-x-reverse">
            
            {user && user.role === 'Admin' && (
                <Link href={routes.dashboard} className='flex items-center space-x-2 rtl:space-x-reverse'>
                    <SiTerraform className="h-5 w-5 text-gray-500" />
                    <span className='cursor-pointer font-medium'>Admin dashboard</span>
                </Link>
            )}
               <Link href={routes.profile} className='flex items-center space-x-2 rtl:space-x-reverse'>
            <FaRegUser  className="h-5 w-5 text-gray-500" />
        <span className='cursor-pointer font-medium'> {user?.name}</span>
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