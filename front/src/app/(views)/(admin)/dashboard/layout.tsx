"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const variants = {
    hidden: { opacity: 0, x: 30 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar fija */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed top-0 left-0 h-full shadow-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-green-400 tracking-wide">
            Admin Panel
          </h2>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className={`block px-3 py-2 rounded-md transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-green-600 text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/users"
                className={`block px-3 py-2 rounded-md transition-colors ${
                  pathname === "/dashboard/users"
                    ? "bg-green-600 text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                Usuarios
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/crops"
                className={`block px-3 py-2 rounded-md transition-colors ${
                  pathname === "/dashboard/crops"
                    ? "bg-green-600 text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                Terrenos
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          © 2025 AgroTrack
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col ml-64">
        {/* Header fijo */}
        <header className="bg-white shadow p-4 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-800">Mi Dashboard</h1>
        </header>

        {/* Contenido animado */}
        <div className="p-8 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              variants={variants}
              initial="hidden"
              animate="enter"
              exit="exit"
              transition={{ type: "tween", duration: 0.3 }}
              className="bg-white shadow rounded-xl p-6 min-h-[70vh]"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
