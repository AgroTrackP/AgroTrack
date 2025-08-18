"use client"
import React from 'react'
import useProtection from './useProtection';
import { BiLoader } from 'react-icons/bi';


const RoutesProtection = ({ children }: { children: React.ReactNode }) => {

    const { isLoading } = useProtection();

    if (isLoading) {
        return <div className='w-screen h-screen justify-center flex items-center'>
            <BiLoader />
        </div>
    }
    return <>
        {children}
    </>
}

export default RoutesProtection

