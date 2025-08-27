"use client";

import { FC } from "react";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer/footer";
import NavBar from "@/components/layout/navbar/navbar";
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface LayoutMainViewsProps {
    children: React.ReactNode;
}

const LayoutMainViews: FC<LayoutMainViewsProps> = ({ children }) => {
    const pathname = usePathname();

    const variants = {
        hidden: { opacity: 0, y: 20 },
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    return (
        <>
            <NavBar />
            <Container>
                <AnimatePresence mode="wait">
                    <motion.main
                        key={pathname}
                        variants={variants}
                        initial="hidden"
                        animate="enter"
                        exit="exit"
                            transition={{ type: 'tween', duration: 0.3 }}
                    >
                        {children}
                    </motion.main>
                </AnimatePresence>
            </Container>
            <Footer />
        </>
    )
}

export default LayoutMainViews;