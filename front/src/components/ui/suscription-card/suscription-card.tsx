'use client';

import { ISuscription } from '@/types';
import { Check } from 'lucide-react';

interface SuscriptionCardProps {
  plan: ISuscription & { highlight?: boolean };
  onSubscribe: (plan: ISuscription) => void;
  isLoading: boolean;
}

const SuscriptionCard = ({ plan, onSubscribe, isLoading }: SuscriptionCardProps) => {
  
  // --- Lógica de Estilos Dinámicos ---
  const cardClasses = plan.highlight
    ? "border-green-500 border-2"
    : plan.name === 'Premium'
      ? "bg-gray-800 text-white border-gray-700"
      : "bg-white border-gray-200";

  const buttonClasses = plan.highlight
    ? "bg-green-600 text-white hover:bg-green-700"
    : plan.name === 'Premium'
      ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
      : "bg-white text-green-600 border-green-600 hover:bg-green-50";

  const checkmarkColor = plan.name === 'Premium' ? "text-green-400" : "text-green-500";
  const headerClasses = plan.highlight ? 'border-green-600' : plan.name === 'Premium' ? 'border-yellow-400' : 'border-green-300';


  return (
    // --- 1. AÑADE UN MARGEN SUPERIOR SI LA TARJETA ESTÁ DESTACADA ---
    <div className={`w-full p-8 rounded-2xl shadow-xl border transition-transform transform hover:-translate-y-2 relative ${cardClasses} ${plan.highlight ? 'mt-6 md:mt-0' : ''}`}>
      
      {plan.highlight && (
        // --- 2. AJUSTA LA POSICIÓN DE LA ETIQUETA ---
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 text-sm font-semibold text-white bg-green-600 rounded-full shadow-md">
            Más Popular
          </span>
        </div>
      )}
      
      <div className={`absolute top-0 left-0 right-0 h-2 rounded-t-2xl ${headerClasses}`}></div>

      <h3 className="text-2xl font-semibold mt-4 mb-2 text-center">{plan.name}</h3>
      <p className={`text-5xl font-bold mb-6 text-center ${plan.name === 'Premium' ? 'text-white' : 'text-gray-800'}`}>
        ${plan.price}
        <span className="text-lg font-normal text-gray-500">/mes</span>
      </p>

      <ul className="space-y-4 text-left mb-10">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className={`w-5 h-5 mr-3 flex-shrink-0 ${checkmarkColor}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSubscribe(plan)}
        disabled={isLoading}
        className={`w-full py-3 px-6 rounded-lg font-semibold border transition-colors duration-200 disabled:opacity-50 disabled:cursor-wait ${buttonClasses}`}
      >
        {isLoading ? 'Procesando...' : 'Suscribirme'}
      </button>
    </div>
  );
};

export default SuscriptionCard;