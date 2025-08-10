import Image from 'next/image'
import React from 'react'

interface CarouselItemProps {
    imgUrl: string,
    alt?: string
}
const CarouselItem: React.FC<CarouselItemProps> = ({imgUrl, alt}) => {
    return (
        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
            <Image
                src={imgUrl}
                alt={alt || "Imagen carrusel"}
                fill
                className='object-cover transition-all duration-500 ease-in-out'
                priority
            />
        </div>
    )
}

export default CarouselItem
