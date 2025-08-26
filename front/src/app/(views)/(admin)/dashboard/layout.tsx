import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Barra Lateral (Sidebar) */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
        <nav>
          <ul>
            <li><Link href="/dashboard" className="block py-2">Inicio</Link></li>
            <li><Link href="/dashboard/users" className="block py-2">Usuarios</Link></li>
            {/* --- AÑADE ESTA LÍNEA --- */}
            <li><Link href="/dashboard/crops" className="block py-2">Terrenos</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white shadow p-4">
          <h1 className="text-xl font-semibold">Mi Dashboard</h1>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}