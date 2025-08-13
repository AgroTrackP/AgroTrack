'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'

import SuscriptionCard from '@/components/ui/suscription-card/suscription-card'
import { useAuthContext } from '@/context/authContext'
import { subscriptions } from '@/helpers/suscripciones'
import { ISuscription } from '@/types'

const stripeKey = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const SuscriptionList = () => {
    const router = useRouter();
    const { user, isAuth } = useAuthContext();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const handleSubscribeClick = async (plan: ISuscription) => {
        if (!isAuth || !user) {
            alert("Debes iniciar sesión para suscribirte."); 
            router.push('/login');
            return;
        }

        setLoadingPlan(plan.priceId);

        try {

            //este bloque solo es para ver q se envia
            const dataToSend = {
                userId: user.id,
                priceId: plan.priceId,
            };
            console.log("Enviando al backend:", dataToSend);


            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    priceId: plan.priceId, 
                }),
            });
            
            const session = await response.json();
            console.log("Respuesta recibida del back", session);
            
            if (!response.ok) {
                throw new Error(session.error || "No se pudo crear la sesión de pago.");
            }

            const stripe = await stripeKey;
            if (stripe) {
                const { error } = await stripe.redirectToCheckout({
                    sessionId: session.id,
                });

                if (error) {
                    alert(error.message || "Error al redirigir a la página de pago");
                }
            }
        } catch (error) {
            let errorMessage = "Ocurrio un error"
            if(error instanceof Error){
                errorMessage = error.message
            }
            alert(errorMessage)
        } finally {
            
            setLoadingPlan(null);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-32">
            {subscriptions?.map((suscription) => (
                <SuscriptionCard
                    {...suscription}
                    key={suscription.priceId}
                    onSubscribe={handleSubscribeClick}
                    isLoading={loadingPlan === suscription.priceId}
                />
            ))}
            {!subscriptions?.length && <span>No hay suscripciones</span>}
        </div>
    );
}
export default SuscriptionList;