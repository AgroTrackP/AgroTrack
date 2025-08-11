'use client'
import SuscriptionCard from '@/components/ui/suscription-card/suscription-card'
import { subscriptions } from '@/helpers/suscripciones'
import React from 'react'

const SuscriptionList = () => {
    return (
        <>
            <div className="w-full max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-32" >
                {subscriptions?.map((suscription)=>(
                    <SuscriptionCard 
                        {...suscription} 
                        key={suscription.priceId}
                    />
                ))}

                {!subscriptions?.length && <span>No hay suscripciones</span>}
            </div>
        </>
    )
}
export default SuscriptionList