'use client'
import React from 'react';
import useProtection from './useProtection';
import Loader from '@/components/ui/loader/loader';
import { useEffect, useState } from 'react';

const RoutesProtection = ({ children }: { children: React.ReactNode }) => {
    const { isLoading } = useProtection();
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => setShowLoader(false), 3000); 
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (isLoading || showLoader) return <Loader minHeight="100vh" />;

    return <>{children}</>;
};

export default RoutesProtection;
