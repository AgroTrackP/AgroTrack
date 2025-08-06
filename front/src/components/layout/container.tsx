import React, { FC } from "react";

interface ContainerProps {
    children: React.ReactNode;
}

const Container: FC<ContainerProps> = ({ children }) => {
    return (
        <>
            <div className='w-full max-w-none mt-20 mx-auto px-4 sm:px-6 lg:px-8 min-h-[70vh]'>{children}</div>
        </>
    )
}

export default Container