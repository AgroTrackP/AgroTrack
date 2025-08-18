"use client"
import { useAuthContext } from "@/context/authContext"
import { routes } from "@/routes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProteccionStatus {
    isLoading: boolean;
    isAllowed: boolean;
}

const useProtection = (): ProteccionStatus => {
    const { isAuth } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAllowed, setIsAllowed] = useState<boolean>(false);

    useEffect(() => {
        if (isAuth === null) {
            setIsLoading(true);
            return;
        }

        // Rutas a las que un usuario sin loguear no pueda ingresar
        const privateRoutes = [routes.profile, routes.mis_cultivos];

        // Rutas a las que un usuario logueado pueda ingresar
        const guestRoutes = [routes.login, routes.register];

        const isPrivateRoute = privateRoutes.includes(pathname);
        const isGuestRoute = guestRoutes.includes(pathname);

        // Usuario no logueado intenta acceder a una ruta privada
        if (!isAuth && isPrivateRoute) {
            router.push(routes.login);
            setIsAllowed(false);
        }
        //Usuario si logueado intenta acceder a login / register
        else if (isAuth && isGuestRoute) {
            router.push(routes.home);
            setIsAllowed(false);
        }
        // En cualquier otro caso, el acceso está permitido
        else {
            setIsAllowed(true);
        }

        setIsLoading(false);

    }, [isAuth, pathname, router]);

    return { isLoading, isAllowed };
}

export default useProtection;