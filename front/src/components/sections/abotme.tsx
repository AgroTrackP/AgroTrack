import Image from 'next/image'
import React from 'react'

const AboutMe = () => {
    return (
        <section className="w-full  mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-32 bg-secondary-50 mt-10">

            <div className="w-full md:w-1/2 ml-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary-900">
                    Sobre AgroTrack
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed">
                    <strong>AgroTrack</strong> es una plataforma digital diseñada para transformar la forma
                    en que agricultores y productores gestionan sus cultivos. Nuestra misión es brindar
                    herramientas tecnológicas simples pero poderosas que permitan planificar, monitorear y
                    optimizar cada etapa del proceso agrícola.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed mt-4">
                    Desde el registro de siembras hasta el seguimiento del calendario de cultivos, AgroTrack te
                    ayuda a tomar decisiones informadas, aumentar la productividad y reducir el desperdicio.
                    Creemos en el poder del campo y en el valor de impulsar el agro con innovación y tecnología
                    accesible para todos.
                </p>
            </div>

            <div className="w-1/2" >
                <Image
                    src='https://res.cloudinary.com/dbemhu1mr/image/upload/v1756307429/5ef0f13f-4804-48a7-936d-631862ce0697.png'
                    alt='about me'
                    width={900}
                    height={400}
                    className='rounded-bl-3xl object-cover w-full h-auto shadow-lg'
                />
            </div>
        </section>
    )
}

export default AboutMe
