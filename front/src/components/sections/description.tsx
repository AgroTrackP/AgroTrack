'use client';

import React from 'react';

const SeedIcon = () => (
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <span className="text-3xl">🌱</span>
    </div>
);
const WaterIcon = () => (
    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-3xl">💧</span>
    </div>
);
const HarvestIcon = () => (
    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
        <span className="text-3xl">🌾</span>
    </div>
);
const ChartIcon = () => (
    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
        <span className="text-3xl">📈</span>
    </div>
);

const DescriptionHome = () => {
    return (
        <section className="w-full py-20 px-4 bg-white">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">El Viaje de tu Cosecha</h2>
                <p className="mt-4 text-lg text-gray-600">
                    De la siembra al éxito, te acompañamos en cada etapa.
                </p>

                <div className="mt-12 flex flex-col md:flex-row justify-between gap-8 md:gap-4 relative">

                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200" style={{ transform: 'translateY(-50%)', top: '4rem' }}></div>

                    <div className="flex md:flex-col items-center text-center z-10">
                        <SeedIcon />
                        <div className="ml-4 md:ml-0 md:mt-4">
                            <h3 className="text-xl font-semibold text-gray-800">Siembra</h3>
                            <p className="mt-1 text-gray-600">Registras tu terreno y cultivo. La planificación inteligente comienza.</p>
                        </div>
                    </div>

                    <div className="flex md:flex-col items-center text-center z-10">
                        <WaterIcon />
                        <div className="ml-4 md:ml-0 md:mt-4">
                            <h3 className="text-xl font-semibold text-gray-800">Cuidado</h3>
                            <p className="mt-1 text-gray-600">Recibes la primera recomendación de riego. Ahorras agua, tiempo y dinero.</p>
                        </div>
                    </div>

                    <div className="flex md:flex-col items-center text-center z-10">
                        <HarvestIcon />
                        <div className="ml-4 md:ml-0 md:mt-4">
                            <h3 className="text-xl font-semibold text-gray-800">Cosecha</h3>
                            <p className="mt-1 text-gray-600">Registras tu producción y obtienes datos precisos sobre el rendimiento.</p>
                        </div>
                    </div>

                    <div className="flex md:flex-col items-center text-center z-10">
                        <ChartIcon />
                        <div className="ml-4 md:ml-0 md:mt-4">
                            <h3 className="text-xl font-semibold text-gray-800">Post-Cosecha</h3>
                            <p className="mt-1 text-gray-600">Analizas los reportes para entender tu rentabilidad y planificar el próximo ciclo.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default DescriptionHome;