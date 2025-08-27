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

    // useEffect para centrar la vista al navegar con el ancla #planes
    useEffect(() => {
        if (window.location.hash === '#planes') {
            const element = document.getElementById('planes');
            if (element) {
                const timer = setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
                return () => clearTimeout(timer);
            }
        }
    }, []);

    // useEffect para buscar los planes disponibles
    useEffect(() => {
        const fetchPlans = async () => {
            setLoadingPlans(true);
            try {
                const response = await fetch('/api/subscription-plan');
                if (!response.ok) {
                    throw new Error("No se pudieron cargar los planes");
                }
                const data = await response.json();
                
                // Añade la propiedad 'highlight' al plan "Pro"
                const plansWithHighlight = data.map((plan: ISuscription) => ({
                    ...plan,
                    highlight: plan.name === 'Pro',
                }));
                setPlans(plansWithHighlight);
                
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                }
            } finally {
                setLoadingPlans(false);
            }
        };
        
        if (subscription?.status !== 'active') {
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
            if (!token) {
                throw new Error("Error: El token de autenticación no está disponible.");
            }

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
            if (!response.ok) {
                throw new Error(session.error || "No se pudo crear la sesión de pago.");
            }

            const stripe = await stripeKey;
            if (stripe) {
                const { error } = await stripe.redirectToCheckout({
                    sessionId: session.id,
                });
                if (error) {
                    throw new Error(error.message || "Error al redirigir a la página de pago");
                }
            }
        } catch (error) {
            let errorMessage = "Ocurrió un error";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setLoadingPlan(null);
        }
    };

    // Oculta por completo el componente si el usuario ya tiene un plan activo
    if (isAuth && subscription?.status === "active") {
        return null;
    }

    if (loadingPlans) {
        return <div id="planes" className="text-center py-20">Cargando planes...</div>;
    }

    if (error) {
        return <div id="planes" className="text-center py-20">Error: {error}</div>;
    }

    return (
        <div id="planes" className="w-full max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-10 md:gap-8">
            {plans?.map((plan) => (
                <SuscriptionCard
                    key={plan.stripePriceId}
                    plan={plan}
                    onSubscribe={handleSubscribeClick}
                    isLoading={loadingPlan === plan.stripePriceId}
                />
            ))}
            {!plans?.length && <span>No hay suscripciones disponibles.</span>}
        </div>
    );
};

export default SuscriptionList;