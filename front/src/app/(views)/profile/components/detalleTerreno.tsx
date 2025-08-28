/* eslint-disable @next/next/no-img-element */
'use client';

import { IApplicationPlan, IRecommendations } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';


import { useAuthContext } from '@/context/authContext';
import { Loader2, Info, Droplets, CheckCircle, XCircle, Calendar, FlaskConical, Sun } from "lucide-react";

// FullCalendar
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es';

// --- INTERFACES ---
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
interface IWeatherData {
  locationName: string;
  temperature: string;
  feelsLike: string;
  humidity: string;
  description: string;
  windSpeed: string;
  icon: string;
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

const InfoCard = ({ icon: Icon, title, children, className = '' }: { icon: React.ElementType, title: string, children: React.ReactNode, className?: string }) => (
  <div className={`bg-gray-50 p-4 rounded-lg border flex flex-col ${className}`}>
    <h3 className="font-semibold text-lg flex items-center text-gray-700 mb-2 flex-shrink-0">
      <Icon className="w-5 h-5 mr-2 text-green-600" />
      {title}
    </h3>
    <div className="text-sm text-gray-600 space-y-1 overflow-y-auto custom-scrollbar flex-grow min-h-0">
      {children}
    </div>
  </div>
);

const DetalleTerreno: React.FC<IProps> = ({ terrenoId, isOpen, onClose }) => {
  const { token } = useAuthContext();
  const [planPlantationData, setPlanPlantationData] = useState<IDetalleTerrenoData | null>(null);
  const [weatherData, setWeatherData] = useState<IWeatherData | null>(null);
  const [isLoadingDetalle, setIsLoadingDetalle] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (isOpen && terrenoId && token) {
      const fetchData = async () => {
        setIsLoadingDetalle(true);
        try {
          const [plantationRes, weatherRes] = await Promise.all([
            axios.get(`https://agrotrack-develop.onrender.com/plantations/${terrenoId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`https://agrotrack-develop.onrender.com/plantations/${terrenoId}/weather`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);
          setPlanPlantationData(plantationRes.data);
          setWeatherData(weatherRes.data);
        } catch (error) {
          console.error("Error al cargar detalle/clima del terreno:", error);
        } finally {
          setIsLoadingDetalle(false);
        }
      };
      fetchData();
    }
  }, [isOpen, terrenoId, token]);

  const handleClose = () => {
    setPlanPlantationData(null);
    setWeatherData(null);
    onClose();
  };

  const plansForSelectedDay = planPlantationData?.applicationPlans.filter(plan =>
    isSameDay(new Date(plan.planned_date), selectedDate)
  ) || [];

  return (
    <Popup open={isOpen} onClose={handleClose} modal nested contentStyle={{ width: '90%', maxWidth: '1400px' }}>
      <div className="p-6 bg-white rounded-lg shadow-xl w-full h-[90vh] flex flex-col">
        <button onClick={handleClose} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700 z-20">&times;</button>
        
        {isLoadingDetalle && (
          <div className="flex-grow flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
            <p className="mt-3 text-gray-700 font-medium">Cargando información del terreno...</p>
          </div>
        )}
        
        {!isLoadingDetalle && planPlantationData && (
          <>
            <h2 className="text-3xl font-bold mb-4 border-b pb-3 text-gray-800 flex-shrink-0">
              {planPlantationData.name}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-0">
              
              {/* --- COLUMNA 1: DATOS Y CLIMA --- */}
              <div className="flex flex-col gap-6">
                <InfoCard icon={Info} title="Datos Generales">
                  <p><strong>Tipo de Cultivo:</strong> {planPlantationData.crop_type}</p>
                  <p><strong>Área:</strong> {planPlantationData.area_m2} m²</p>
                  <p><strong>Temporada:</strong> {planPlantationData.season}</p>
                  <p><strong>Fecha de Inicio:</strong> {new Date(planPlantationData.start_date).toLocaleDateString()}</p>
                </InfoCard>

                
                {weatherData && (
                  <InfoCard icon={Sun} title={`Clima en ${weatherData.locationName}`}>
                    <div className="flex items-center">
                      <img src={weatherData.icon} alt={weatherData.description} className="w-16 h-16 mr-4"/>
                      <div>
                        <p className="text-3xl font-bold">{weatherData.temperature}</p>
                        <p className="capitalize">{weatherData.description}</p>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                      <p><strong>Sensación:</strong> {weatherData.feelsLike}</p>
                      <p><strong>Humedad:</strong> {weatherData.humidity}</p>
                      <p><strong>Viento:</strong> {weatherData.windSpeed} </p>
                    </div>
                  </InfoCard>
                )}

                
              </div>

              {/* --- COLUMNA 2: CALENDARIO Y TAREAS --- */}
              <div className="flex flex-col gap-6">
                <div className="bg-white p-2 rounded-lg border">
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    locale={esLocale}
                    headerToolbar={{ start: 'title', center: '', end: 'prev,next' }}
                    height="450px" // Usando la altura fija que definimos
                    
                    // --- LÓGICA DE FECHA MODIFICADA AQUÍ ---
                    events={planPlantationData.applicationPlans.map(plan => {
                      // 1. Creamos un objeto de fecha a partir de la fecha del plan
                      const originalDate = new Date(plan.planned_date);
                      
                      // 2. Le restamos un día a esa fecha
                      originalDate.setDate(originalDate.getDate() - 1);

                      return {
                        title: plan.disease?.name || 'Aplicación',
                        // 3. Formateamos la nueva fecha (un día antes) a YYYY-MM-DD
                        date: originalDate.toISOString().split('T')[0],
                        color: plan.status === 'pending' ? '#f59e0b' : '#16a34a',
                        extendedProps: { status: plan.status }
                      };
                    })}

                    dateClick={(info) => setSelectedDate(info.date)}
                    eventClick={(info) => setSelectedDate(info.event.start!)}
                    dayMaxEvents={true}
                    initialDate={new Date()}
                  />
                </div>
                <InfoCard icon={Calendar} title={`Tareas para el ${selectedDate.toLocaleDateString('es-ES', {day: 'numeric', month: 'long'})}`} className="flex-grow">
                    {plansForSelectedDay.length > 0 ? (
                      <div className="space-y-3">
                        {plansForSelectedDay.map(plan => (
                          <div key={plan.id} className="p-3 border-l-4 border-green-500 bg-green-50 rounded">
                            <p className="font-semibold">{plan.disease?.name || 'Aplicación General'}</p>
                            <div className="flex items-center text-sm mt-1">
                              {plan.status === 'completed' ? <CheckCircle className="w-4 h-4 text-green-600 mr-2"/> : <XCircle className="w-4 h-4 text-green-600 mr-2"/>}
                              <span className="font-bold capitalize">{plan.status === 'pending' ? 'Pendiente' : 'Completado'}</span>
                            </div>
                            <p className="text-sm"><strong>Agua:</strong> {plan.total_water} L</p>
                            {plan.items && plan.items.length > 0 && (
                                <>
                                    <h4 className="font-medium mt-2">Productos:</h4>
                                    <ul className="list-disc list-inside pl-4 text-xs">
                                    {plan.items.map(item => <li key={item.id}>{item.product.name} ({item.calculated_quantity} un.)</li>)}
                                    </ul>
                                </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No hay planes para este día.</p>
                    )}
                </InfoCard>
              </div>

              {/* --- COLUMNA 3: RECOMENDACIONES --- */}
              <div className="flex flex-col gap-6">
                {planPlantationData.recommendations && (
                  <>
                    <InfoCard icon={FlaskConical} title="Recomendaciones del Sistema" className="flex-grow">
                       <p><strong>Siembra:</strong> {planPlantationData.recommendations.planting_notes}</p>
                       <p><strong>Fertilizante:</strong> {planPlantationData.recommendations.recommended_fertilizer}</p>
                       <p><strong>Notas:</strong> {planPlantationData.recommendations.additional_notes}</p>
                    </InfoCard>
                    <InfoCard icon={Droplets} title="Riego y Aplicación">
                      <p><strong>Agua recomendada:</strong> {planPlantationData.recommendations.recommended_water_per_m2} L/m²</p>
                      <p className="mt-2"><strong>Tipo:</strong> {planPlantationData.recommendations.recommended_application_type?.name}</p>
                    </InfoCard>
                  </>
                )}
              </div>
            </div>
          </>
        )}
        {!isLoadingDetalle && !planPlantationData && (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-center py-10 text-red-500">No se pudieron cargar los detalles del terreno.</p>
          </div>
        )}
      </div>
    </Popup>
  );
};

export default DetalleTerreno;