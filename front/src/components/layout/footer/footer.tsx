import React from 'react'
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className=" bg-primary-500 " >
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <a href="#" className="flex items-center">
                        <Image
                            src="https://res.cloudinary.com/dbemhu1mr/image/upload/v1754425159/Agrotrack_jkoeuj.ico"
                            alt="Agro Track"
                            width={56}
                            height={56}
                            className="rounded-full"
                        />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap text-secondary-50 p-3">AgroTrack</span>
                        </a>
                    </div>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto border-primary-700 lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm sm:text-center text-secondary-50">© 2025 <a href="#" className="hover:underline">AgroTrack™</a>. All Rights Reserved.
                    </span>
                    <div className="flex mt-4 sm:justify-center sm:mt-0">
                        <a href="#" className="text-secondary-400 hover:text-white">
                            <FaFacebookF className='text-xl'/>
                            <span className="sr-only">Facebook page</span>
                        </a>
                        <a href="#" className="text-secondary-400 hover:text-white ms-5">
                            <FaTwitter className='text-xl' />
                            <span className="sr-only">Twitter page</span>
                        </a>
                        <a href="#" className="text-secondary-400 hover:text-white ms-5">
                            <AiFillInstagram className='text-xl' />
                            <span className="sr-only">Instagram page</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>

    )
}

export default Footer
