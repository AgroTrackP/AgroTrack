'use client'
import React, { useEffect, useState } from 'react'
import CarouselItem from './carouselItem';

interface ImgItem {
    id: number,
    url: string
}

const Carousel: React.FC = () => {

    const [images, setImages] = useState<ImgItem[]>([]);
    const [imgActual, setImgActual] = useState<number>(0);

    useEffect(() => {
        const hardcodedImages: ImgItem[] = [
            { id: 1, url: "https://res.cloudinary.com/dbemhu1mr/image/upload/v1754497365/carrusel_pvmmd4.png" },
            { id: 2, url: "https://res.cloudinary.com/dbemhu1mr/image/upload/v1754497365/carrusel1_mueesa.png" },
            { id: 3, url: "https://res.cloudinary.com/dbemhu1mr/image/upload/v1754497365/carrusel2_aoj3au.png" },
        ];

        setImages(hardcodedImages);
    }, []);

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
