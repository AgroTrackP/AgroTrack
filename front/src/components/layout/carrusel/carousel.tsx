'use client'
import React, { useEffect, useState } from 'react'
import CarouselItem from './carouselItem';
import { motion, AnimatePresence } from 'framer-motion';

interface ImgItem {
    id: number,
    url: string,
    text: string
}

const Carousel: React.FC = () => {

    const [images, setImages] = useState<ImgItem[]>([]);
    const [imgActual, setImgActual] = useState<number>(0);

    const frases = [
        "La agricultura es la base de la vida.",
        "Sembrar hoy es cosechar mañana.",
        "La tierra es nuestro mayor tesoro.",
        "Cultivar con amor da frutos eternos.",
        "El campo alimenta al mundo."
    ];


    useEffect(() => {
        const fetchImg = async () => {
            try {
                const response = await fetch("https://agrotrack-develop.onrender.com/cloudinary/carrucel");
                const data: ImgItem[] = await response.json();
                setImages(data);
            } catch (error) {
                console.error("Error al cargar las imagenes: ", error);
            }
        };
        fetchImg();
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setImgActual((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images]);


    const nextImg = () => {
        setImgActual((prev) => (prev + 1) % images.length);
    };

    const prevImg = () => {
        setImgActual((prev) => (prev - 1 + images.length) % images.length);
    }

    if (images.length === 0) {
        return <p className='text-center mt-4'>Cargando imagenes...</p>
    }

    return (
        <div>
            <div className="relative flex items-center justify-center w-full overflow-hidden">
                <button
                    onClick={prevImg}
                    className="z-10 text-3xl px-4 py-2 bg-transparent hover:text-gray-700"
                >
                    ⟨
                </button>

                <CarouselItem imgUrl={images[imgActual].url} alt={`Imagen ${imgActual + 1}`} />

                <AnimatePresence mode="wait">
                    <motion.p
                        key={imgActual} // cambia con la imagen para animar cada frase
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center 
                       text-white text-3xl md:text-5xl font-bold text-center drop-shadow-lg"
                    >
                        {frases[imgActual % frases.length]}
                    </motion.p>
                </AnimatePresence>

                <button
                    onClick={nextImg}
                    className="z-10 text-3xl px-4 py-2 bg-transparent hover:text-gray-700"
                >
                    ⟩
                </button>
            </div>

        </div>
    )
}

export default Carousel
