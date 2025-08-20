"use client";

import { useAuthContext } from "@/context/authContext";
import React from "react";


const UserSuscription = () => {
    const {subscription} = useAuthContext();

    return (
        <div className="p-4 border rounded-lg bg-white/10 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-2">Información del Plan</h3>
            {subscription ? (
                <div>
                    <p><span className="font-semibold">Plan:</span> {subscription.planName}</p>
                    <p><span className="font-semibold">Estado:</span> <span className={subscription.status === 'active' ? 'text-primary-700' : 'text-red-400'}>{subscription.status}</span></p>
                </div>
            ) : (
                <p>Actualmente no tienes ninguna suscripción activa.</p>
            )}
        </div>
    )
}

export default UserSuscription;