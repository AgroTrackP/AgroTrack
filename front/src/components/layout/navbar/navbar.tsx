import { routes } from "@/routes"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import AuthNavbar from "./authNavbar"

const NavBar = () => {
    return (
        <>
            <nav className="bg-primary-500  fixed w-full z-20 top-0 start-0 border-b border-gray-200 border-primary-700">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a
                        href={routes.home}
                        className="flex items-center space-x-3 rtl:space-x-reverse"
                    >
                        <Image
                            src="https://res.cloudinary.com/dbemhu1mr/image/upload/v1754425159/Agrotrack_jkoeuj.ico"
                            alt="Agro Track"
                            width={56}
                            height={56}
                            className="rounded-full"
                        />
                        <span className="self-center text-4xl font-semibold whitespace-nowrap text-secondary-50">AgroTrack</span>
                    </a>
                    <ul className="flex space-x-4">
                        {/* <Link
                            className="block py-2 px-3 text-secondary-50 text-lg font-semibold md:p-0  hover:text-secondary-200"
                            href={routes.login}
                        >
                            Login
                        </Link>
                        <Link
                            className="block py-2 px-3 text-secondary-50 text-lg font-semibold md:p-0 hover:text-secondary-200"
                            href={routes.register}
                        >
                            Register
                        </Link>
                        <Link
                            className="block py-2 px-3 text-secondary-50 text-lg font-semibold md:p-0 hover:text-secondary-200"
                            href={routes.profile}
                        >
                            Profile
                        </Link>
                        <Link
                            className="block py-2 px-3 text-secondary-50 text-lg font-semibold md:p-0 hover:text-secondary-200"
                            href={routes.mis_cultivos}
                        >
                            Cultivos
                        </Link> */}
                    </ul>
                <AuthNavbar />
                </div>
            </nav>
        </>
    )
}
export default NavBar