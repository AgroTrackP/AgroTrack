import { FC } from "react";

interface LayoutMainAuthProps {
    children: React.ReactNode;
}

const LayoutMainAuth: FC<LayoutMainAuthProps> = ({children}) => {
    return( 

    <div className="flex min-h-screen">
        {/* Left side: White background with card */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse">
                    <div className="flex items-center justify-center w-fit gap-2">
                        <></>
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                        AgroTrack
                        </span>
                    </div>
                </div>
            <div>{children}</div>
        </div>
    </div>
            {/* Right side: Full image */}
    <div className="hidden md:block md:w-1/2 h-screen ">
        <img
            src="https://plus.unsplash.com/premium_photo-1678652878688-e4638fbff9bb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Auth"
            className="object-cover w-full h-full"
            />
        </div>
    </div>
)
};
export default LayoutMainAuth;