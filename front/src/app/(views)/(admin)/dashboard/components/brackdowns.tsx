'use client';

// --- Helper functions moved outside the component for better performance ---

// Función auxiliar para crear la descripción del arco SVG
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const d = [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    'L', x, y,
    'Z',
  ].join(' ');
  return d;
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
}


// --- Component Data ---

const subscriptionData = [
  { name: 'Básica', value: 300, color: '#6ee7b7' }, // Verde claro
  { name: 'Pro', value: 210, color: '#3b82f6' },   // Azul
  { name: 'Premium', value: 90, color: '#a855f7' }, // Morado
];

// --- The React Component ---

export function SubscriptionBreakdown() {
  const totalSubscriptions = subscriptionData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Desglose de Suscripciones</h3>
      <div className="relative w-64 h-64 mx-auto">
        {/* Usamos un SVG para dibujar el gráfico */}
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {subscriptionData.map((item, index) => {
            const angle = (item.value / totalSubscriptions) * 360;
            const startAngle = subscriptionData
              .slice(0, index)
              .reduce((sum, i) => sum + (i.value / totalSubscriptions) * 360, 0);
            
            // Dibuja la porción del gráfico
            const pathData = describeArc(100, 100, 100, startAngle, startAngle + angle);
            
            // --- CAMBIOS PARA EL TEXTO ---
            // 1. Usamos un radio más pequeño para posicionar el texto hacia adentro
            const textRadius = 75; 
            const textPosition = polarToCartesian(100, 100, textRadius, startAngle + angle / 2);

            return (
              <g key={item.name}>
                <path d={pathData} fill={item.color} />
                <text
                  x={textPosition.x}
                  y={textPosition.y}
                  fill="black" // 2. Color cambiado a negro
                  fontWeight="bold" // 3. Añadido negrita para mejor visibilidad
                  textAnchor="middle"
                  fontSize="14"
                  dominantBaseline="central"
                >
                  {Math.round((item.value / totalSubscriptions) * 100)}%
                </text>
              </g>
            );
          })}
        </svg>

        {/* Círculo central con el total */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center bg-white w-24 h-24 rounded-full flex flex-col justify-center">
          <strong className="text-2xl font-semibold">{totalSubscriptions}</strong>
          <p className="text-sm text-gray-500">Total</p>
        </div>
      </div>
      
      {/* Leyenda del gráfico */}
      <div className="mt-6 flex justify-center space-x-4">
        {subscriptionData.map((item) => (
          <div key={item.name} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}