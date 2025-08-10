import SuscriptionCard from '@/components/ui/suscription-card/suscription-card'
import { subscriptions } from '@/helpers/suscripciones'
import React from 'react'

const SuscriptionList = () => {
    return (
        <>
            <div className="w-full max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-32" >
                {subscriptions?.map((suscription)=>(
                    <SuscriptionCard {...suscription} key={suscription.id}/>
                ))}

                {!subscriptions?.length && <span>No hay suscripciones</span>}
            </div>
        </>
    )
}
// className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 justify-center'

export default SuscriptionList
