import React from 'react';
import Image from 'next/image'; 

const InformationHome = () => {
    return (
        <section className="w-full mx-auto px-4 py-20 flex flex-col items-center justify-center gap-16 mt-10 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-8 max-w-4xl leading-tight">
                Evoluciona tu Forma de Cultivar 
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-16 w-full max-w-6xl">
                <div className="flex flex-col gap-6 w-full md:w-1/2">
                    <div className="text-lg md:text-xl text-gray-700 space-y-4">
                        <p className="flex items-start gap-3">
                            <span className="text-green-600 font-bold text-2xl">🌱</span>
                            <span className="flex-1">
                                <strong className="block text-green-700 text-2xl font-semibold">1. Planifica y Registra tu Terreno</strong>
                                Define el área de tu cultivo, el tipo de siembra y tus objetivos. Centraliza toda la información de tus terrenos en un solo lugar.
                            </span>
                        </p>
                        <p className="flex items-start gap-3">
                            <span className="text-green-600 font-bold text-2xl">💧</span>
                            <span className="flex-1">
                                <strong className="block text-green-700 text-2xl font-semibold">2. Aplica y Monitorea con Precisión</strong>
                                Recibe recomendaciones basadas en datos sobre cuándo y cuánto regar o fertilizar. Registra cada aplicación para un control exacto.
                            </span>
                        </p>
                        <p className="flex items-start gap-3">
                            <span className="text-yellow-600 font-bold text-2xl">📊</span>
                            <span className="flex-1">
                                <strong className="block text-green-700 text-2xl font-semibold">3. Analiza y Aprende de tus Cosechas</strong>
                                La cosecha es el comienzo del aprendizaje. Analiza los resultados de cada ciclo y convierte tus datos en conocimiento.
                            </span>
                        </p>
                        <p className="flex items-start gap-3">
                            <span className="text-purple-600 font-bold text-2xl">📈</span>
                            <span className="flex-1">
                                <strong className="block text-green-700 text-2xl font-semibold">4. Optimiza y Vende al Mejor Precio</strong>
                                Con un historial completo de producción y costos, gestiona tu inventario y maximiza la rentabilidad de tu trabajo.
                            </span>
                        </p>
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex justify-center items-center">
                    <Image
                        src="https://res.cloudinary.com/dbemhu1mr/image/upload/v1756312156/9448954c-8f97-4280-a363-be3559078261.png" 
                        alt="Evolución de la gestión de cultivos"
                        width={600} 
                        height={400}
                        layout="responsive" 
                        objectFit="contain" 
                        className="rounded-lg shadow-xl"
                    />
                </div>
            </div>
        </section>
    );
}

export default InformationHome;