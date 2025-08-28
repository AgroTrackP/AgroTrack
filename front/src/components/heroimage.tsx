import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const HeroImage = () => {
    return (
        <section className="relative h-[40vh] w-full mt-20 mb-0 overflow-hidden">
            <Image
                src="https://res.cloudinary.com/dbemhu1mr/image/upload/v1754663439/Gemini_Generated_Image_vl64csvl64csvl64_1_1_kmegj4.png"
                alt="Fondo Hero"
                width={1920}
                height={1080}
                className="absolute inset-0 w-full h-full object-cover brightness-75"
            />
            <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">
                <h1 className="text-secondary-50 text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                    Bienvenido a AgroTrack
                </h1>
                <p className="text-slate-50 text-lg md:text-xl mb-6 max-w-xl drop-shadow-md">
                    Tecnología para el campo. Gestiona tus cultivos, mejora tus decisiones y haz crecer tu producción.
                </p>
                <Link
                    href="/contact"
                    className="bg-primary-600 hover:bg-primary-700 text-slate-50 font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300"
                >
                    Contáctanos
                </Link>
            </div>
        </section>
    );
};

export default HeroImage;