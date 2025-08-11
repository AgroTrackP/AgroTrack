import { ISuscription } from '@/types'
import React, { FC, useState } from 'react'
import Button from '../button'
import { loadStripe } from '@stripe/stripe-js'
import Popup from 'reactjs-popup'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './checkout-form'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const SuscriptionCard: FC<ISuscription> = ({
    priceId,
    name,
    price,
    benefits,
}) => {

    const [open, setOpen] = useState(false)

    const handleOpenPopup = () => {
        setOpen(true)
    }
    return (
        <div className="w-full h-[400px] flex flex-col justify-between border border-secondary-300 rounded-lg p-6 shadow-md">
            <h5 className="mb-4 text-xl font-medium text-primary-900">{name || "Nombre del plan"}</h5>
            <div className="flex items-baseline text-primary-900">
                <span className="text-sm font-semibold">$</span>
                <span className="text-sm font-extrabold tracking-tight">{price || "precio del plan"}</span>
            </div>
            <ul className="my-7 space-y-5">
                {benefits?.length ? (
                    benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center space-x-3">
                            <svg
                                className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-base font-normal leading-tight text-primary-900 ">
                                {benefit || "Aun no hay beneficios"}
                            </span>
                        </li>
                    ))
                ) : (
                    <li className="text-primary-900">Sin beneficios especificados</li>
                )}
            </ul>
            <Button
                label="Suscribirme"
                onClick={handleOpenPopup}
            />

            <Popup open={open} onClose={() => setOpen(false)} modal nested>
                <div className='bg-primary-500 p-20 relative border-2 bor'>
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-900"
                        aria-label="Cerrar"
                    >
                        &times;
                    </button>

                    {/* prueba de datos front */}
                    <div>
                    <p >
                        Plan ID: <strong>{priceId}</strong>
                    </p>
                    <p >
                        Plan Name: <strong>{name}</strong>
                    </p>
                    <p >
                        Plan Price: <strong>{price}</strong>
                    </p>
                    </div>

                    <hr className="my-4 border-gray-300" />

                    <h2 >Completa tu pago</h2>
                    <Elements stripe={stripePromise} >
                        <CheckoutForm priceId={priceId} />
                    </Elements>
                </div>
            </Popup>
        </div>
    )
}

export default SuscriptionCard