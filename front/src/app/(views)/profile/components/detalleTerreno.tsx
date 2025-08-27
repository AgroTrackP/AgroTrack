'use client';

import { IApplicationPlan, IRecommendations } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { useAuthContext } from '@/context/authContext';

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

const DetalleTerreno: React.FC<IProps> = ({ terrenoId, isOpen, onClose }) => {
    const { token } = useAuthContext();
    const [planPlantationData, setPlanPlantationData] = useState<IDetalleTerrenoData | null>(null);
    const [isLoadingDetalle, setIsLoadingDetalle] = useState(false);

    useEffect(() => {
        if (isOpen && terrenoId && token) {
            const fetchPlanPlantationData = async () => {
                setIsLoadingDetalle(true);
                setPlanPlantationData(null);
                try {
                    const response = await axios.get(`https://agrotrack-develop.onrender.com/plantations/${terrenoId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
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

    return (
        <Popup open={isOpen} onClose={handleClose} modal nested contentStyle={{ width: '90%', maxWidth: '1280px' }} >
            <div className="p-8 bg-white rounded-lg shadow-xl w-full">
                <button onClick={handleClose} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800">&times;</button>
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">Detalles del Terreno: {planPlantationData?.name}</h2>

                {isLoadingDetalle ? (
                    <div className="text-center py-10">Cargando información...</div>
                ) : planPlantationData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-h-[70vh] overflow-y-auto pr-4 text-left">
                        
                        {/* --- COLUMNA IZQUIERDA: DATOS Y PLANES --- */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg border-b pb-1 mb-2">Datos Generales</h3>
                                <p><strong>Área:</strong> {planPlantationData.area_m2} m²</p>
                                <p><strong>Tipo de Cultivo:</strong> {planPlantationData.crop_type}</p>
                                <p><strong>Temporada:</strong> {planPlantationData.season}</p>
                                <p><strong>Fecha de Inicio:</strong> {new Date(planPlantationData.start_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg border-b pb-1 mb-2">Planes de Aplicación</h3>
                                {planPlantationData.applicationPlans?.length > 0 ? (
                                    <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                        {planPlantationData.applicationPlans.map((plan) => (
                                            <li key={plan.id}>
                                                Fecha: {new Date(plan.planned_date).toLocaleDateString()}, Agua: {plan.total_water}L, Estado: {plan.status}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (<p className="text-gray-500 italic">No hay planes de aplicación registrados.</p>)}
                            </div>
                        </div>

                        {/* --- COLUMNA DERECHA: RECOMENDACIONES --- */}
                        <div className="space-y-4">
                            {planPlantationData.recommendations ? (
                                <div>
                                    <h3 className="font-semibold text-lg border-b pb-1 mb-2">Recomendaciones del Sistema</h3>
                                    <p><strong>Notas de siembra:</strong> {planPlantationData.recommendations.planting_notes}</p>
                                    <p><strong>Agua recomendada:</strong> {planPlantationData.recommendations.recommended_water_per_m2} L/m²</p>
                                    <p><strong>Fertilizante:</strong> {planPlantationData.recommendations.recommended_fertilizer}</p>
                                    <p><strong>Notas adicionales:</strong> {planPlantationData.recommendations.additional_notes}</p>

                                    <h4 className="font-semibold mt-4">Tipo de Aplicación Recomendado:</h4>
                                    <p>{planPlantationData.recommendations.recommended_application_type?.name || 'No especificado'}</p>
                                    
                                    <h4 className="font-semibold mt-4">Productos Recomendados:</h4>
                                    {planPlantationData.recommendations.recommended_products?.length > 0 ? (
                                        <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                            {planPlantationData.recommendations.recommended_products.map((product) => (
                                                <li key={product.id}><strong>{product.name}</strong></li>
                                            ))}
                                        </ul>
                                    ) : (<p className="text-gray-500 italic">No hay productos recomendados.</p>)}
                                    
                                    <h4 className="font-semibold mt-4">Enfermedades Comunes a Vigilar:</h4>
                                    {planPlantationData.recommendations.recommended_diseases?.length > 0 ? (
                                        <ul className="list-disc list-inside pl-4 text-sm">
                                            {planPlantationData.recommendations.recommended_diseases.map(disease => (
                                                <li key={disease.id}><strong>{disease.name}</strong></li>
                                            ))}
                                        </ul>
                                    ) : (<p className="text-gray-500 italic">No hay enfermedades a vigilar.</p>)}
                                </div>
                            ) : (<p className="text-gray-500 italic">No hay recomendaciones disponibles para este tipo de cultivo.</p>)}
                        </div>
                    </div>
                ) : (
                    <p className="text-center py-10">No se pudieron cargar los detalles del terreno.</p>
                )}
            </div>
        </Popup>
    );
}

export default DetalleTerreno;