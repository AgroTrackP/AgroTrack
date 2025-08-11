import Image from 'next/image'
import React from 'react'

const AboutMe = () => {
    return (
        <section className="w-full max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-32">
            <div className="w-full md:w-1/2 " >
                <Image
                    src='https://res.cloudinary.com/dbemhu1mr/image/upload/v1754863524/img_1_pwjyxj.png'
                    alt='about me'
                    width={1024}
                    height={559}
                    className='rounded-br-full object-cover w-full h-auto shadow-lg'
                />
            </div>

            <div className="w-full md:w-1/2">
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
        </section>
    )
}

export default AboutMe
