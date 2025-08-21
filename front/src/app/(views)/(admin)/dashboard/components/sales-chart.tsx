// src/app/(admin)/dashboard/_components/sales-chart.tsx
'use client';

// Datos falsos para el gráfico
const mockSalesData = [
  { name: 'Mar', total: 4850 },
  { name: 'Abr', total: 3210 },
  { name: 'May', total: 5600 },
  { name: 'Jun', total: 3900 },
  { name: 'Jul', total: 6100 },
  { name: 'Ago', total: 5250 },
];

// Función para formatear los números (ej: 4850 -> $4.9k)
function formatSalesValue(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value}`;
}

export function SalesChart() {
  const maxSales = Math.max(...mockSalesData.map(item => item.total));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Ventas de los últimos 6 meses</h3>
      <div className="w-full h-80 pt-6 flex items-end justify-around space-x-2 md:space-x-4">
        {mockSalesData.map((month) => {
          // Se calcula la altura de la barra como un porcentaje
          const barHeight = `${(month.total / maxSales) * 100}%`;

          return (
            <div key={month.name} className="flex flex-col items-center flex-1 h-full">
              {/* Contenedor relativo para posicionar el valor y la barra */}
              <div className="relative w-full h-full flex items-end">
                {/* Etiqueta con el valor, ahora siempre visible */}
                <div 
                  className="absolute left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-600"
                  style={{ bottom: `calc(${barHeight} + 4px)` }} // Se posiciona 4px arriba de la barra
                >
                  {formatSalesValue(month.total)}
                </div>

                {/* La barra del gráfico */}
                <div 
                  className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                  style={{ height: barHeight }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">{month.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}