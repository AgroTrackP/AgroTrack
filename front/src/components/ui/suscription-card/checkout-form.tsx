import React, { useState } from 'react'
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement, CardElement } from '@stripe/react-stripe-js'
import Button from '../button'

interface Props {
  priceId: string
}

const CheckoutForm: React.FC<Props> = ({ priceId }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')


  // const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault()
  //     if (!stripe || !elements) return

  //     setLoading(true)

  //     const res = await fetch('/api/checkout/session', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ priceId })
  //     })
  //     const data = await res.json()

  //     if (data.clientSecret) {
  //         const result = await stripe.confirmCardPayment(data.clientSecret, {
  //             payment_method: {
  //                 card: elements.getElement(CardElement)!
  //             }
  //         })

  //         if (result.error) {
  //             alert(result.error.message)
  //         } else {
  //             alert('Pago completado con éxito!')
  //         }
  //     }
  //     setLoading(false)
  // }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const isConfirmed = window.confirm("¿Estás seguro de que quieres realizar el pago?");

    if (!isConfirmed) {
        return; 
    }

    setLoading(true);

    if (!stripe || !elements) {
      return; 
    }

    setLoading(true);

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (cardNumberElement == null) {
      console.error("El elemento del número de tarjeta no se encontró.");
      setLoading(false);
      return;
    }
    
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
    });

    if (error) {
      setMessage(error.message || "Ocurrio un error.");
      //console.error(error);
      
    } else {
      setMessage('¡Tarjeta verificada con exito! Token: ' + paymentMethod.id);
      //console.log('PaymentMethod creado con éxito:', paymentMethod);

      elements.getElement(CardNumberElement)?.clear();
      elements.getElement(CardExpiryElement)?.clear();
      elements.getElement(CardCvcElement)?.clear();
    }
    setLoading(false)
  };

  return (
    <form onSubmit={handleSubmit} className=" max-w-md mx-auto p-4 space-y-4 w-60 ">

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-700">Número de Tarjeta</label>
        <CardNumberElement className="p-3 border rounded-md" />
      </div>

      <div className="flex space-x-4">
        <div className="flex-1 flex flex-col">
          <label className="text-sm font-medium mb-1 text-gray-700">Vencimiento</label>
          <CardExpiryElement className="p-3 border rounded-md" />
        </div>
        <div className="flex-1 flex flex-col">
          <label className="text-sm font-medium mb-1 text-gray-700">CVC</label>
          <CardCvcElement className="p-3 border rounded-md" />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || loading}
        label='Pagar'
        className="w-full  py-2 rounded-md disabled:bg-gray-400"
      >
        {loading ? 'Procesando...' : 'Pagar'}
      </Button>
      {message && <div className='text-center text-sm mt-2'>{message}</div>}
    </form>
  )
}

export default CheckoutForm
