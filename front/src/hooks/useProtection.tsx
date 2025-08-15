"use client"
import { useAuthContext } from "@/context/authContext"
import { routes } from "@/routes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProteccionStatus {
    isLoanding: boolean;
    isAllowed: boolean;
}

const useProtection = (): ProteccionStatus => {
    const { isAuth } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();

    const [isLoading, setIsLoanding] = useState<boolean>(true);
    const [isAllowed, setIsAllowed] = useState<boolean>(false);

    useEffect(() => {

        if (isAuth === null) {
            setIsLoanding(true);
            return;
        }

        const publicRoutes = [routes.login, routes.register];
        const privateRoutes = [routes.profile, routes.mis_cultivos, routes.cancel, routes.success]

        const isPublicRoute = publicRoutes.includes(pathname);
        const isPrivateRoute = privateRoutes.includes(pathname);

        let userHasPermission = true;
        if ((isAuth && isPublicRoute) || (!isAuth && isPrivateRoute)) {
            router.push(routes.home);
            userHasPermission = false;
        }

        setIsAllowed(userHasPermission);
        setIsLoanding(false)

    }, [isAuth, pathname, router]);

    return { isLoanding: isLoading, isAllowed };
}

export default useProtection;
