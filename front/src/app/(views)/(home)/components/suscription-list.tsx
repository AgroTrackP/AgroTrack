'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Popup from 'reactjs-popup'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import SuscriptionCard from '@/components/ui/suscription-card/suscription-card'
import CheckoutForm from '@/components/ui/suscription-card/checkout-form'
import { useAuthContext } from '@/context/authContext'
import { subscriptions } from '@/helpers/suscripciones'
import { ISuscription } from '@/types'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const SuscriptionList = () => {
    const router = useRouter();
    const { isAuth } = useAuthContext(); 

    const [open, setOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<ISuscription | null>(null);

    const handleSubscribeClick = (plan: ISuscription) => {
        if (!isAuth) {
            alert("Debes iniciar sesión para suscribirte.");
            router.push('/login'); 
        } else {
            setSelectedPlan(plan);
            setOpen(true);
        }
    };

    const closeModal = () => setOpen(false);

    return (
        <>
            <div className="w-full max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-32" >
                {subscriptions?.map((suscription)=>(
                    <SuscriptionCard 
                        {...suscription} 
                        key={suscription.priceId}
                        onSubscribe={handleSubscribeClick}
                    />
                ))}
                {!subscriptions?.length && <span>No hay suscripciones</span>}
            </div>

            <Popup open={open} onClose={closeModal} modal nested>
                {selectedPlan && (
                    <div className='bg-primary-500 p-20 relative border-2'>
                        <button onClick={closeModal} className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-900" aria-label="Cerrar">
                            &times;
                        </button>
                        <div>
                            <p>Plan ID: <strong>{selectedPlan.priceId}</strong></p>
                            <p>Plan Name: <strong>{selectedPlan.name}</strong></p>
                            <p>Plan Price: <strong>{selectedPlan.price}</strong></p>
                        </div>
                        <hr className="my-4 border-gray-300" />
                        <h2>Completa tu pago</h2>
                        <Elements stripe={stripePromise}>
                            <CheckoutForm priceId={selectedPlan.priceId} />
                        </Elements>
                    </div>
                )}
            </Popup>
        </>
    )
}
export default SuscriptionList;