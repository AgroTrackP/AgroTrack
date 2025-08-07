import SuscriptionCard from '@/components/ui/suscription-card/suscription-card'
import { subscriptions } from '@/helpers/suscripciones'
import React from 'react'

const SuscriptionList = () => {
    return (
        <>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 justify-center'>
                {subscriptions?.map((suscription)=>(
                    <SuscriptionCard {...suscription} key={suscription.id}/>
                ))}

                {!subscriptions?.length && <span>No hay suscripciones</span>}
            </div>
        </>
    )
}

export default SuscriptionList
