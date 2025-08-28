"use client";

import { useAuthContext } from "@/context/authContext";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";

const UserSuscription = () => {
    const { subscription, refetchSubscription, token, user } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleCancelSubscription = async () => {
        if (!token || !user?.id) {
            toast.error("No se puede encontrar la información de la suscripción");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`/api/stripe/cancel/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId: user?.id })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'No se pudo cancelar la suscripción.');
            }

            toast.success(result.message || "Tu suscripción ha sido cancelada con éxito.");

            if (refetchSubscription) {
                await refetchSubscription();
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Ocurrió un error inesperado.");
            }
        } finally {
            setIsLoading(false);
            setConfirmOpen(false);
        }
    }
    return (
        <div className="p-4 border rounded-lg bg-white/10 backdrop-blur-sm">

            {subscription && subscription.plan ? (
                <div>
                    <p><span className="font-semibold">Plan:</span> {subscription.plan.name}</p>
                    <p><span className="font-semibold">Estado:</span> <span className={subscription.status === 'active' ? 'text-primary-700' : 'text-red-400'}>{subscription.status}</span></p>
                    <p><span className="font-semibold">Precio:</span> ${subscription.plan.price}</p>
                    {subscription.status === 'active' && (
                        <button
                            onClick={() => setConfirmOpen(true)}
                            disabled={isLoading}
                            className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Cancelando...' : 'Cancelar Suscripción'}
                        </button>
                    )}
                </div>
            ) : (
                <p>Actualmente no tienes ninguna suscripción activa.</p>
            )}

            <Popup open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <div className="p-8 bg-white rounded-lg shadow-xl text-center max-w-sm border border-primary-300">
                    <h3 className="text-lg font-bold">¿Estás seguro?</h3>
                    <p className="my-4 text-gray-600">
                        Si cancelas, perderás el acceso a los beneficios al final de tu ciclo de facturación.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => setConfirmOpen(false)}
                            className="px-6 py-2 bg-gray-100 rounded-md border border-primary-300  hover:bg-primary-500"
                        >
                            No, mantener
                        </button>
                        <button
                            onClick={handleCancelSubscription}
                            className="px-6 py-2 bg-red-500 text-white rounded-md border border-primary-300  hover:bg-red-700"
                        >
                            Sí, cancelar
                        </button>
                    </div>
                </div>
            </Popup>
        </div>
    )
}

export default UserSuscription;