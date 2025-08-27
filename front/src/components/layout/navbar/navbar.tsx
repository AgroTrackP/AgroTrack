"use client";

import { routes } from "@/routes";
import Image from "next/image";
import React from "react";
import AuthNavbar from "./authNavbar";
import { motion } from "framer-motion";

const NavBar = () => {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-primary-500 fixed w-full z-50 top-0 start-0 border-b border-primary-700 shadow-md"
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <a
          href={routes.home}
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            src="https://res.cloudinary.com/dbemhu1mr/image/upload/v1754425159/Agrotrack_jkoeuj.ico"
            alt="Agro Track"
            width={48}
            height={48}
            className="rounded-full shadow"
          />
          <span className="self-center text-3xl font-bold whitespace-nowrap text-secondary-50 tracking-wide">
            AgroTrack
          </span>
        </a>

        {/* Links */}
        <ul className="hidden md:flex space-x-6">
          {/* Ejemplo de enlaces si querés activarlos */}
          {/* <Link href={routes.login} className="text-secondary-50 text-lg font-medium hover:text-secondary-200 transition">Login</Link> */}
        </ul>

        {/* Auth Section */}
        <AuthNavbar />
      </div>
    </motion.nav>
  );
};

export default NavBar;
