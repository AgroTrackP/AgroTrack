'use client';

import { IApplicationPlan, IRecommendations } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { useAuthContext } from '@/context/authContext';
import { Loader2 } from "lucide-react";
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Esta interfaz ahora puede ser más simple porque IRecommendations es correcta
interface IDetalleTerrenoData {
    id: string;
    name: string;
    area_m2: string;
    crop_type: string;
    location: string;
    start_date: string;
    season: string;
    applicationPlans: IApplicationPlan[];
    recommendations: IRecommendations | null;
}

interface IProps {
    terrenoId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
};

const DetalleTerreno: React.FC<IProps> = ({ terrenoId, isOpen, onClose }) => {
    const { token } = useAuthContext();
    const [planPlantationData, setPlanPlantationData] = useState<IDetalleTerrenoData | null>(null);
    const [isLoadingDetalle, setIsLoadingDetalle] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    useEffect(() => {
        if (isOpen && terrenoId && token) {
            const fetchPlanPlantationData = async () => {
                setIsLoadingDetalle(true);
                setPlanPlantationData(null);
                try {
                    const response = await axios.get(
                        `https://agrotrack-develop.onrender.com/plantations/${terrenoId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setPlanPlantationData(response.data);
                } catch (error) {
                    console.error("Error al cargar detalle del terreno:", error);
                } finally {
                    setIsLoadingDetalle(false);
                }
            };
            fetchPlanPlantationData();
        }
    }, [isOpen, terrenoId, token]);

    const handleClose = () => {
        setPlanPlantationData(null);
        onClose();
    };

    const getTileClassName = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month' && planPlantationData) {
            const hasPendingPlan = planPlantationData.applicationPlans.some(plan => 
                isSameDay(new Date(plan.planned_date), date) && plan.status === 'pending'
            );
            if (hasPendingPlan) {
                return 'pending-day'; 
            }
        }
        return '';
    };

    const plansForSelectedDay = planPlantationData?.applicationPlans.filter(plan =>
        isSameDay(new Date(plan.planned_date), selectedDate)
    ) || [];

    return (
        <Popup open={isOpen} onClose={handleClose} modal nested contentStyle={{ width: '90%', maxWidth: '1280px' }}>
            <div className="p-8 bg-white rounded-lg shadow-xl w-full">
                <button onClick={handleClose} className="absolute top-4 right-4 text-2xl text-secondary-500 hover:text-gray-800">&times;</button>
                <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary-700">Detalles del Terreno: {planPlantationData?.name}</h2>

                {isLoadingDetalle && (
                    <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center rounded-lg z-50">
                        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
                        <p className="mt-3 text-gray-700 font-medium">Cargando información...</p>
                    </div>
                )}

                {!isLoadingDetalle && planPlantationData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-h-[70vh] overflow-y-auto pr-4 text-left">

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg border-b pb-1 mb-2 text-primary-700">Datos Generales</h3>
                                <p><strong>Área:</strong> {planPlantationData.area_m2} m²</p>
                                <p><strong>Tipo de Cultivo:</strong> {planPlantationData.crop_type}</p>
                                <p><strong>Temporada:</strong> {planPlantationData.season}</p>
                                <p><strong>Fecha de Inicio:</strong> {new Date(planPlantationData.start_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg border-b pb-1 mb-2 text-primary-700">Planes de Aplicación</h3>
                                {planPlantationData.applicationPlans?.length > 0 ? (
                                    <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                        {planPlantationData.applicationPlans.map((plan) => (
                                            <li key={plan.id}>
                                                Fecha: {new Date(plan.planned_date).toLocaleDateString()}, Agua: {plan.total_water}L, Estado: {plan.status}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 italic">No hay planes de aplicación registrados.</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {planPlantationData.recommendations ? (
                                <div>
                                    <h3 className="font-semibold text-lg border-b pb-1 mb-2 text-primary-700">Recomendaciones del Sistema</h3>
                                    <p><strong>Notas de siembra:</strong> {planPlantationData.recommendations.planting_notes}</p>
                                    <p><strong>Agua recomendada:</strong> {planPlantationData.recommendations.recommended_water_per_m2} L/m²</p>
                                    <p><strong>Fertilizante:</strong> {planPlantationData.recommendations.recommended_fertilizer}</p>
                                    <p><strong>Notas adicionales:</strong> {planPlantationData.recommendations.additional_notes}</p>
                                    <h4 className="font-semibold mt-4">Tipo de Aplicación Recomendado:</h4>
                                    <p>{planPlantationData.recommendations.recommended_application_type?.name || 'No especificado'}</p>
                                    <p>{planPlantationData.recommendations.recommended_application_type?.description}</p>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No hay recomendaciones disponibles para este tipo de cultivo.</p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg border-b pb-1 mb-2 text-primary-700">Calendario de Aplicaciones</h3>
                                <Calendar
                                    onChange={(value) => setSelectedDate(value as Date)}
                                    value={selectedDate}
                                    tileClassName={getTileClassName}
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Tareas para el {selectedDate.toLocaleDateString()}</h3>
                                {plansForSelectedDay.length > 0 ? (
                                    <div className="space-y-4">
                                        {plansForSelectedDay.map(plan => (
                                            <div key={plan.id} className="p-3 border rounded-md bg-secondary-50">
                                                <p><strong>Enfermedad a tratar:</strong> {plan.disease.name}</p>
                                                <p><strong>Estado:</strong> <span className="font-bold text-primary-600">{plan.status}</span></p>
                                                <p><strong>Agua Total:</strong> {plan.total_water} L</p>
                                                <h4 className="font-medium mt-2">Productos a aplicar:</h4>
                                                <ul className="list-disc list-inside pl-4 text-sm">
                                                    {plan.items.map(item => (
                                                        <li key={item.id}>{item.product.name} ({item.calculated_quantity} unidades)</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No hay planes de aplicación para este día.</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
                {!isLoadingDetalle && !planPlantationData && (
                    <p className="text-center py-10">No se pudieron cargar los detalles del terreno.</p>
                )}
            </div>
        </Popup>
    );
}

export default DetalleTerreno;
