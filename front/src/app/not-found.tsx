import Container from '@/components/layout/container';
import Footer from '@/components/layout/footer/footer';
import Navbar from '@/components/layout/navbar/navbar';
import { routes } from '@/routes';
import React from 'react';

const NotFound = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <Container>
                    <div className='flex flex-col items-center justify-center h-full'>
                        <h1 className='text-5xl font-bold text-primary-900 mt-16'>
                            Página no encontrada
                        </h1>
                        <h3 className='text-9xl font-extrabold text-secondary-500 mt-12'>
                            404
                        </h3>
                        <a 
                            className="mt-6 px-4 py-2 bg-primary-600 text-secondary-50  rounded hover:bg-primary-400"
                            href={routes.home}
                        >
                            volver a Home
                        </a>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
};

export default NotFound;
