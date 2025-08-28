"use client"; // Necesario para usar hooks como usePathname

import { FC } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface LayoutMainAuthProps {
    children: React.ReactNode;
}

const LayoutMainAuth: FC<LayoutMainAuthProps> = ({ children }) => {
    const pathname = usePathname();

    const variants = {
        hidden: { opacity: 0, x: 20, y: 0 },
        enter: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: -20, y: 0 },
    };

    return (
        <div className="flex min-h-screen">
            {/* Lado izquierdo: Formulario */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white">
                <div className="bg-white rounded-lg p-8 w-full max-w-md">
                    <div className="flex items-center justify-center space-x-3 mb-8">
                        {/* Logo o Título */}
                        <span className="self-center text-3xl font-semibold whitespace-nowrap text-green-700">
                            AgroTrack
                        </span>
                    </div>
                    
                    {/* Contenido con animación */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            variants={variants}
                            initial="hidden"
                            animate="enter"
                            exit="exit"
                            transition={{ type: 'tween', duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Lado derecho: Imagen */}
            <div className="hidden md:block md:w-1/2 h-screen relative">
                <Image
                    src="https://plus.unsplash.com/premium_photo-1678652878688-e4638fbff9bb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Imagen más temática
                    alt="Campo agrícola"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority={true}
                />
            </div>
        </div>
    );
};

export default LayoutMainAuth;