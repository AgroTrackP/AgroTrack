// src/components/layout/navbar/authNavbar.tsx

"use client"; // <-- AÑADE ESTA LÍNEA

import Button from "@/components/ui/button";
import { useAuthContext } from "@/context/authContext";
import { routes } from "@/routes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { SiTerraform } from "react-icons/si";
import { LayoutDashboard } from "lucide-react";
import Popup from "reactjs-popup";
export const AuthNavbar = () => {
    const { isAuth, logoutUser, user, subscription } = useAuthContext();
    const router = useRouter();
    const [subscriptionPopup, setSubscriptionPopup] = useState(false);

    const userSubscription = subscription?.status === 'active';

    const logout = () => {
        logoutUser();
        router.push(routes.home);
    };

    const handleuserSuscription = (e: React.MouseEvent) => {
        if (!userSubscription) {
            e.preventDefault();
            setSubscriptionPopup(true);
        }
    }

    if (isAuth === null) {
        return null; // O un componente de carga (loader)
    }

    if (!isAuth) {
        return (
            <div>
                <Link href={routes.login}>
                    <Button
                        label="Iniciar Sesion"
                        className="!text-white !bg-green-800 !border-green-800 hover:!bg-green-900 transition-colors duration-300 ease-in-out"
                        variant='outline'
                    />
                </Link>
                <Link href={routes.register}>
                    <Button
                        label="Registrarse"
                        className=" !text-white !bg-green-800 !border-green-800 hover:!bg-green-900 transition-colors duration-300 ease-in-out"
                        variant='outline'
                    />
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-9 rtl:space-x-reverse">
            {user?.role === 'Admin' && (
                <Link href={routes.dashboard} className='flex items-center space-x-2 rtl:space-x-reverse'>
                    <LayoutDashboard className="h-5 w-5 text-gray-500" />
                    <span className='cursor-pointer font-medium'>Admin dashboard</span>
                </Link>
            )}

            <Link href={routes.profile} className='flex items-center space-x-2 rtl:space-x-reverse'>
                <FaRegUser className="h-5 w-5 text-gray-500" />
                <span className='cursor-pointer font-medium'> {user?.name}</span>
            </Link>

            <Link
                href={routes.page}
                className={`flex items-center space-x-2 rtl:space-x-reverse ${!userSubscription ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500'}`}
                onClick={handleuserSuscription}
            >
                <SiTerraform className="h-5 w-5 text-gray-500" />
                <span className='cursor-pointer font-medium'>Agregar cultivos</span>
            </Link>

            <div onClick={logout} className="cursor-pointer">
                <MdLogout className="h-5 w-5 text-gray-500" />
            </div>

            <Popup open={subscriptionPopup} onClose={() => setSubscriptionPopup(false)} modal>
                <div className="p-8 bg-white rounded-lg shadow-xl text-center max-w-sm border border-primary-300">
                    <h3 className="text-lg font-bold text-gray-800">Funciones con plan</h3>
                    <p className="my-4 text-gray-600">
                        Necesitas una suscripción activa para poder registrar nuevos cultivos.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => setSubscriptionPopup(false)}
                            className="px-6 py-2 bg-gray-200 rounded-md border border-primary-300  hover:bg-primary-500"
                        >
                            Cerrar
                        </button>
                        <Link
                            href={routes.home}
                            className="px-6 py-2 bg-secondary-400 text-white rounded-md border border-primary-300  hover:bg-secondary-700"
                            onClick={() => setSubscriptionPopup(false)}
                        >
                            Ver planes
                        </Link>
                    </div>
                </div>
            </Popup>
        </div>
    )
};

export default AuthNavbar;