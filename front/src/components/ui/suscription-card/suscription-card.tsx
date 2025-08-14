import { ISuscription } from '@/types'
import React, { FC } from 'react'
import Button from '../button'
interface SuscriptionCardProps extends ISuscription {
    onSubscribe: (plan: ISuscription) => void;
    isLoading: boolean;
}

const SuscriptionCard: FC<SuscriptionCardProps> = ({
    priceId,
    name,
    price,
    benefits,
    onSubscribe,
    isLoading
}) => {
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
                            <svg className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                            <span className="text-base font-normal leading-tight text-primary-900 ">{benefit || "Aun no hay beneficios"}</span>
                        </li>
                    ))
                ) : (
                    <li className="text-primary-900">Sin beneficios especificados</li>
                )}
            </ul>
            <Button
                label={isLoading ? 'Procesando...' : 'Suscribirme'}
                onClick={() => onSubscribe({ priceId, name, price, benefits })}
                disabled={isLoading}
            />

            {/* <a
                href="https://buy.stripe.com/test_14A28r2JOaSF1H38mM2kw08"
                target="_blank" 
                className="bg-green-500 text-white text-center font-bold py-2 px-4 rounded"
            >
                Probar Flujo de Pago
            </a> */}
        </div>
    )
}

export default SuscriptionCard;