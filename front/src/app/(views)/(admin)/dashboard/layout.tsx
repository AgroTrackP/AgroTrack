// app/(admin)/dashboard/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import Link from "next/link";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  if (!token) redirect("/login");

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== "Admin") redirect("/login");
  } catch (err) {
    console.error("JWT verification failed:", err);
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed top-0 left-0 h-full shadow-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-green-400 tracking-wide">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li><Link href="/dashboard" className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">Inicio</Link></li>
            <li><Link href="/dashboard/users" className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">Usuarios</Link></li>
            <li><Link href="/dashboard/crops" className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">Terrenos</Link></li>
            <li><Link href="/dashboard/messages" className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">Mensajes</Link></li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">© 2025 AgroTrack</div>
      </aside>

      <main className="flex-1 flex flex-col ml-64 p-8">{children}</main>
    </div>
  );
}
