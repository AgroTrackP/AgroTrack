import { ISuscription } from "@/types";

export const subscriptions: ISuscription[] = [
    {
        id: "sub_001",
        plan: "Básico",
        price: 19.99,
        benefits: [
            "Asesoría mensual",
            "Monitoreo de cultivos",
            "Acceso a boletines"
        ]
    },
    {
        id: "sub_002",
        plan: "Premium",
        price: 49.99,
        benefits: [
            "Asesoría semanal",
            "Monitoreo satelital",
            "Alertas por clima",
            "Soporte prioritario"
        ]
    },
    {
        id: "sub_003",
        plan: "Pro",
        price: 29.99,
        benefits: [
            "Asesoría quincenal",
            "Reporte de productividad",
            "Acceso a eventos virtuales"
        ]
    }
];
