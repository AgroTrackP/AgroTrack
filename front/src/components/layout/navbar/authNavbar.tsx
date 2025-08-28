"use client";

import { useAuthContext } from "@/context/authContext";
import { routes } from "@/routes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { LayoutDashboard, LogOut, User, Gem, Tractor, ChevronDown } from "lucide-react";
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import { destroyCookie } from "nookies";

export const AuthNavbar = () => {
    const { isAuth, logoutUser, user, subscription } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [subscriptionPopup, setSubscriptionPopup] = useState(false);

    const userSubscription = subscription?.status === 'active';
    const isAdmin = user?.role === 'Admin';
    const canAddCrops = isAdmin || userSubscription;

   const logout = () => {
    // Borra la cookie del token
    destroyCookie(null, "auth_token", { path: "/" });

    // Lógica existente de logout
    logoutUser();
    router.push(routes.home);
};

    const handleProfileClick = () => {
        setIsMenuOpen(false);
        router.push(routes.profile);
    };

    const handleLogoutClick = () => {
        setIsMenuOpen(false);
        logout();
    };

    const NavLink = ({ href, icon: Icon, children, isActionButton = false }: { 
        href: string, 
        icon: React.ElementType, 
        children: React.ReactNode,
        isActionButton?: boolean 
    }) => {
        const isActive = pathname.startsWith(href);
        
        let classes = `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200`;

        if (isActionButton) {
            classes += ` bg-green-600 text-white shadow-sm hover:bg-green-700`;
        } else {
            classes += isActive 
                ? ` bg-green-100 text-green-800` 
                : ` text-gray-600 hover:bg-gray-100 hover:text-gray-900`;
        }

        return (
            <Link href={href} className={classes}>
                <Icon className="h-5 w-5" />
                <span>{children}</span>
            </Link>
        );
    };

    if (isAuth === null) return <div className="h-16 bg-white"></div>;
    
    if (!isAuth) {
        return (
            <div className="flex items-center space-x-4">
                <Link href={routes.login}>
                    <button className="px-5 py-2 text-sm font-medium text-green-700 bg-white border border-green-600 rounded-lg shadow-sm hover:bg-green-50 transition-colors duration-200">
                        Iniciar Sesión
                    </button>
                </Link>
                <Link href={routes.register}>
                    <button className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200">
                        Registrarse
                    </button>
                </Link>
            </div>
        );
    }
    
    return (
        <div className="flex items-center space-x-4">
            {isAdmin && <NavLink href={routes.dashboard} icon={LayoutDashboard}>Dashboard</NavLink>}
            
            {canAddCrops ? (
                <NavLink href={routes.page} icon={Tractor} isActionButton={true}>Agregar Cultivos</NavLink>
            ) : (
                <Link href="/#planes" className='flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors'>
                    <Gem className="h-5 w-5" />
                    <span>Suscribirse</span>
                </Link>
            )}

            <Popup
                trigger={
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                        <User size={16} className="text-gray-500" />
                        <span className="font-semibold">{user?.name}</span>
                        <ChevronDown size={16} className="text-gray-400" />
                    </button>
                }
                position="bottom right"
                on="click"
                open={isMenuOpen}
                onOpen={() => setIsMenuOpen(true)}
                onClose={() => setIsMenuOpen(false)}
                contentStyle={{ padding: '0px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '8px', width: '200px', marginTop: '8px' }}
                arrow={false}
            >
                <div className="bg-white rounded-md shadow-lg py-2">
                    <button 
                        onClick={handleProfileClick} 
                        className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <User size={16} className="mr-3" />
                        Mi Perfil
                    </button>
                    <button 
    onClick={handleLogoutClick} 
    className="flex items-center w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
>
    <LogOut size={16} className="mr-3" />
    Cerrar Sesión
</button>
                </div>
            </Popup>

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
                            href="/#planes"
                            className="px-6 py-2 bg-secondary-400 text-white rounded-md border border-primary-300  hover:bg-secondary-700"
                            onClick={() => setSubscriptionPopup(false)}
                        >
                             Ver planes
                         </Link>
                     </div>
                 </div>
             </Popup>
        </div>
    );
};

export default AuthNavbar;