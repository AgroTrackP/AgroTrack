'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';


const SuccessPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const timeout = 8000;
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            console.log("Pago exitoso. ID de la sesión:", sessionId);
            // Aquí puedes llamar a tu backend para una verificación final
            // const verifyPayment = async () => {
            //   await fetch('/api/verify-payment', { 
            //     method: 'POST', 
            //     body: JSON.stringify({ sessionId }),
            //   });
            // }
            // verifyPayment();
        }

        const timer = setTimeout(() => {
            router.push('/profile')
        }, timeout);

        return () => clearTimeout(timer);

    }, [sessionId, router]);

    return (
        <div className="flex flex-col  items-center justify-center text-center py-40 gap-1 ">
            <h1 className="text-4xl font-bold text-primary-600 mb-4">¡Gracias por tu suscripción! 🎉</h1>
            <p className="text-lg text-primary-900">Hemos procesado tu pago exitosamente.</p>
            <hr />
            <p className="text-lg text-primary-900">Seras redirigido a tu perfil en unos segundos...</p>
        </div>
    );
}

export default SuccessPage;