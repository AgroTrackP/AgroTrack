'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'

import SuscriptionCard from '@/components/ui/suscription-card/suscription-card'
import { useAuthContext } from '@/context/authContext'
import { ISuscription } from '@/types'
import { toast } from 'react-toastify'

const stripeKey = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const SuscriptionList = () => {
    const router = useRouter();
    const { user, isAuth, token, subscription } = useAuthContext();

    const [plans, setPlans] = useState<ISuscription[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    useEffect(() => {
        if (!subscription) {
            const fetchPlans = async () => {
                try {
                    const response = await fetch('/api/suscriptionPlan');
                    if (!response.ok) {
                        throw new Error("No se pudieron cargar los planes");
                    }
                    const data = await response.json();
                    setPlans(data);
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        setError(err.message);
                    }
                } finally {
                    setLoadingPlans(false);
                }
            };
            fetchPlans();
        } else {
            setLoadingPlans(false);
        }
    }, [subscription]);

    const handleSubscribeClick = async (plan: ISuscription) => {
        if (!isAuth || !user) {
            toast.error("Debes iniciar sesión para suscribirte.");
            router.push('/login');
            return;
        }

        setLoadingPlan(plan.stripePriceId);

        try {

            console.log("Verificando el token antes de enviar: ", token);
            if (!token) {
                alert("Error: El token de autenticación no está disponible. Por favor, vuelve a iniciar sesión.");
                setLoadingPlan(null);
                return;
            }

            //este bloque solo es para ver q se envia
            const dataToSend = {
                userId: user.id,
                priceId: plan.stripePriceId,
            };
            console.log("Enviando al backend:", dataToSend);


            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: user.id,
                    priceId: plan.stripePriceId,
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
            if (error instanceof Error) {
                errorMessage = error.message
            }
            alert(errorMessage)
        } finally {
            setLoadingPlan(null);
        }
    };

    if (isAuth && subscription?.status === "active") {
        return null;
    }

    if (loadingPlans) {
        return <div className="text-center py-20">Cargando planes...</div>
    }

    if (error) {
        return <div className="text-center py-20">Error: {error}</div>
    }
    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-32">
            {plans?.map((plan) => (
                <SuscriptionCard
                    key={plan.stripePriceId}
                    plan={plan}
                    onSubscribe={handleSubscribeClick}
                    isLoading={loadingPlan === plan.stripePriceId}
                />
            ))}
            {!plans?.length && <span>No hay suscripciones</span>}
        </div>
    );
};

export default SuscriptionList;

