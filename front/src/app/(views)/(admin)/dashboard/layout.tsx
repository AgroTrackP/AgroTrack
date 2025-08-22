// src/app/(admin)/dashboard/layout.tsx

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // CAMBIO 1: De h-screen a min-h-screen
    <div className="flex min-h-screen bg-gray-100">
      {/* Barra Lateral (Sidebar) */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
        <nav>
          <ul>
            <li><a href="/dashboard" className="block py-2">Inicio</a></li>
            <li><a href="/dashboard/users" className="block py-2">Usuarios</a></li>
          </ul>
        </nav>
      </aside>

      {/* Contenido Principal */}
      {/* CAMBIO 2: Añadido overflow-y-auto */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Cabecera (Header) */}
        <header className="bg-white shadow p-4">
          <h1 className="text-xl font-semibold">Mi Dashboard</h1>
        </header>
        
        {/* Contenido de la página actual */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}