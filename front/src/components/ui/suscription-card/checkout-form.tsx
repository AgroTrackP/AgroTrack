import React, { useState } from 'react'
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'
import Button from '../button'
import { useAuthContext } from '@/context/authContext'

interface Props {
  priceId: string;
}

const CheckoutForm: React.FC<Props> = ({ priceId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, isAuth } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAuth || !user) {
      setMessage("Debes iniciar sesión para poder suscribirte");
      return;
    }

    const isConfirmed = window.confirm("¿Estás seguro de que quieres realizar el pago?");
    if (!isConfirmed) return;

    setLoading(true);
    setMessage("");

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (cardNumberElement == null) {
      setMessage("El campo de la tarjeta no está listo.");
      setLoading(false);
      return;
    }
    
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
    });

    if (error) {
      setMessage(error.message || "Ocurrió un error.");
    } else {
      setMessage('¡Tarjeta verificada con éxito! Token: ' + paymentMethod.id);
      elements.getElement(CardNumberElement)?.clear();
      elements.getElement(CardExpiryElement)?.clear();
      elements.getElement(CardCvcElement)?.clear();
    }
    setLoading(false);
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
      />
      {message && <div className='text-center text-sm mt-2'>{message}</div>}
    </form>
  )
}
export default CheckoutForm;