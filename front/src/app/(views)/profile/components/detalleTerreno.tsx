import { IApplicationPlan, IRecommendations, IRecommendedProducts } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup';

interface IDetalleTerreno {
    id: string;
    name: string;
    area_m2: string;
    crop_type: string;
    location: string;
    start_date: string;
    season: string;
    applicationPlans: IApplicationPlan[];
    recommendations: IRecommendations;
    recommended_products: IRecommendedProducts[];
}

interface IProps {
    terrenoId: string | null;
    isOpen: boolean;
    onClose: () => void;
}
const DetalleTerreno: React.FC<IProps> = ({ terrenoId, isOpen, onClose }) => {

    const [planPlantationData, setPlanPlantationData] = useState<IDetalleTerreno | null>(null);
    const [isLoadingDetalle, setIsLoadingDetalle] = useState(false);

    useEffect(() => {
        if (isOpen && terrenoId) {
            const fetchPlanPlantationData = async () => {
                setIsLoadingDetalle(true);
                setPlanPlantationData(null);
                try {
                    const response = await axios.get(`https://agrotrack-develop.onrender.com/plantations/${terrenoId}`)
                    console.log("plan de aplicacio", response.data);

                    setPlanPlantationData(response.data);
                } catch (error) {
                    console.error("Error al cargar detalle del terreno:", error);
                } finally {
                    setIsLoadingDetalle(false);
                }
            }
            fetchPlanPlantationData();
        }
    }, [isOpen, terrenoId])

    return (
        <Popup open={isOpen} onClose={onClose} modal nested contentStyle={{ width: '90%', maxWidth: '1280px' }} >
            <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-full border border-primary-500">
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800">&times;</button>
                <h2 className="text-2xl font-bold mb-4 border border-gray-300 p-4">Detalles del Terreno</h2>

                {isLoadingDetalle ? (
                    <p>Cargando información...</p>
                ) : planPlantationData ? (
                    <div className="space-y-2 text-left">
                        <p><strong>Nombre:</strong> {planPlantationData.name}</p>
                        <p><strong>Área:</strong> {planPlantationData.area_m2} m²</p>
                        <p><strong>Tipo de Cultivo:</strong> {planPlantationData.crop_type}</p>
                        <p><strong>Ubicación:</strong> {planPlantationData.location}</p>
                        <p><strong>Temporada:</strong> {planPlantationData.season}</p>
                        <p><strong>Fecha de Inicio:</strong> {new Date(planPlantationData.start_date).toLocaleDateString()}</p>

                        <div className="pt-2">
                            <h3 className="font-semibold border border-gray-300 p-2 mb-2">Planes de Aplicación:</h3>
                            {planPlantationData.applicationPlans && planPlantationData.applicationPlans.length > 0 ? (
                                <ul className="list-disc list-inside pl-2 space-y-1">
                                    {planPlantationData.applicationPlans.map((plan) => (
                                        <li key={plan.id}>
                                            Fecha: {new Date(plan.planned_date).toLocaleDateString()},
                                            Agua: {plan.total_water}L,
                                            Estado: {plan.status}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">No hay planes de aplicación.</p>
                            )}
                        </div>
                        <div>
                            {planPlantationData.recommendations && (
                                <div className="pt-2">
                                    <h3 className="font-semibold border border-gray-300 p-2 mb-2 mt-2">Recomendaciones Generales</h3>
                                    <p><strong>Notas de siembra:</strong> {planPlantationData.recommendations.planting_notes}</p>
                                    <p><strong>Agua recomendada:</strong> {planPlantationData.recommendations.recommended_water_per_m2} L/m²</p>
                                    <p><strong>Fertilizante:</strong> {planPlantationData.recommendations.recommended_fertilizer}</p>
                                    <p><strong>Notas:</strong> {planPlantationData.recommendations.additional_notes}</p>

                                    <h3 className="font-semibold border border-gray-300 p-2 mb-2 mt-2">Productos recomendados:</h3>
                                    {planPlantationData.recommended_products && planPlantationData.recommended_products.length > 0 ? (
                                        <ul className="list-disc list-inside pl-2 space-y-1">
                                            {planPlantationData.recommended_products.map((products) => (
                                                <li key={products.id}>
                                                    Nombre: {products.name}
                                                    Estado: {products.description}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 italic">No hay productos.</p>
                                    )}

                                    <p><strong>Tipo de aplicación:</strong> {planPlantationData.recommendations.recommended_application_type.name}</p>
                                    <p><strong>Descripción:</strong> {planPlantationData.recommendations.recommended_application_type.description}</p>


                                    <h4 className="font-semibold mt-2">Enfermedades Comunes:</h4>
                                    <ul className="list-disc list-inside pl-2">
                                        {planPlantationData.recommendations.recommended_diseases.map(disease => (
                                            <li key={disease.id}>{disease.name}:{disease.description}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>No se pudieron cargar los detalles del terreno.</p>
                )}

            </div>
        </Popup>
    );
}

export default DetalleTerreno