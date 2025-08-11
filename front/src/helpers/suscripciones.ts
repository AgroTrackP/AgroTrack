import { ISuscription } from "@/types";

export const subscriptions: ISuscription[] = [
    {
        priceId: "sub_001",
        name: "Básico",
        price: 19.99,
        benefits: [
            "Asesoría mensual",
            "Monitoreo de cultivos",
            "Acceso a boletines"
        ]
    },
    {
        priceId: "sub_002",
        name: "Premium",
        price: 49.99,
        benefits: [
            "Asesoría semanal",
            "Monitoreo satelital",
            "Alertas por clima",
            "Soporte prioritario"
        ]
    },
    {
        priceId: "sub_003",
        name: "Pro",
        price: 29.99,
        benefits: [
            "Asesoría quincenal",
            "Reporte de productividad",
            "Acceso a eventos virtuales"
        ]
    }
];
