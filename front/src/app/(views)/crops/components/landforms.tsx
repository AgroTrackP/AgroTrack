
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLands } from "@/context/landContext";
import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("./map"), { ssr: false });

const icon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
    shadowSize: [41, 41]
});

interface LatLng {
  lat: number;
  lng: number;
}

function LocationMarker({
  onPositionChange,
}: {
  onPositionChange: (pos: LatLng) => void;
}) {
  const [position, setPosition] = useState<LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onPositionChange(e.latlng);
    },
  });

    return position === null ? null : (
        <Marker position={position} icon={icon}></Marker>
    );
}

const LandForm = () => {
  
  const {createLand, isLoading, error} = useLands ();

  const [formData, setFormData] = useState ({
    
    nombreCultivo: '',
        tipoPlantacion: '',
        temporada: '',
        areaTerreno: '',
        fechaPlantacion: '',
        latitud: null as number |null ,
        longitud: null as number |null,
  });


 const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMapClick = (latlng: LatLng) => {
    setFormData((prev) => ({
      ...prev,
      latitud: latlng.lat,
      longitud: latlng.lng,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  
    const { latitud, longitud, ...landData } = formData;

    await createLand({
      ...landData,
      fechaPlantacion: new Date(formData.fechaPlantacion).getTime(), 
    });
  };

   return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Formulario de Registro de Cultivo</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded-2xl shadow"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre del Cultivo:
            </label>
            <input
              type="text"
              name="nombreCultivo"
              value={formData.nombreCultivo}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tipo de Plantación:
            </label>
            <select
              name="tipoPlantacion"
              value={formData.tipoPlantacion}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
            >
              <option value="">Selecciona...</option>
              <option value="frutas">Frutas</option>
              <option value="vegetales">Vegetales</option>
              <option value="hortalizas">Hortalizas</option>
              <option value="cereales">Cereales</option>
              <option value="ornamentales">Ornamentales</option>
              <option value="pastos">Pastos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Temporada:</label>
            <select
              name="temporada"
              value={formData.temporada}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
            >
              <option value="">Selecciona...</option>
              <option value="verano">Verano</option>
              <option value="invierno">Invierno</option>
              <option value="primavera">Primavera</option>
              <option value="otono">Otoño</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Área (hectáreas):
            </label>
            <input
              type="number"
              id="area"
              name="areaTerreno"
              min="0"
              step="0.01"
              value={formData.areaTerreno}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha de Plantación:
            </label>
            <input
              type="date"
              name="fechaPlantacion"
              value={formData.fechaPlantacion}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
            />
          </div>

          {formData.latitud && formData.longitud && (
            <p className="text-sm text-gray-600">
              📍 Coordenadas: Lat {formData.latitud.toFixed(4)}, Lng{" "}
              {formData.longitud.toFixed(4)}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            {isLoading ? "Guardando..." : "Guardar Cultivo"}
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            Haz clic en el mapa para marcar las coordenadas:
          </h3>
          <div className="rounded-2xl overflow-hidden shadow">
            <MapContainer
              center={[51.505, -0.09]}
              zoom={13}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker onPositionChange={handleMapClick} />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandForm;























// type LandFormProps = {
//   coords?: string; 
// };

// export default function LandForm({ coords = "" }: LandFormProps) {
//   const { user } = useAuthContext();
//   const { setLand } = useLand();
//   const router = useRouter();

//   useEffect(() => {
//     if (!user) router.push("/login");
//   }, [user, router]);

//   const [form, setForm] = useState({
//     name: "",
//     area_m2: "",
//     crop_type: "",
//     location: "",
//     start_date: "",
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

  
//   useEffect(() => {
//     if (coords) setForm((prev) => ({ ...prev, location: coords }));
//   }, [coords]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!form.name || !form.area_m2 || !form.crop_type || !form.location || !form.start_date) {
//       setError("Todos los campos son obligatorios");
//       return;
//     }

//     try {
//       const res = await fetch("https://agrotrack-develop.onrender.com/plantations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       if (!res.ok) {
//         setError("Error al guardar el terreno.");
//         return;
//       }

//       setLand({
//         name: form.name,
//         location: form.location,
//         size: form.area_m2,
//         description: form.crop_type,
//       });

//       setSuccess("Terreno reservado correctamente.");
//       setForm({
//         name: "",
//         area_m2: "",
//         crop_type: "",
//         location: "",
//         start_date: "",
//       });

//       router.push(`/lands/mis-cultivos`);
//     } catch {
//       setError("Error en la conexión con el servidor");
//     }
//   };

//   if (!user) return null;

//   return (
//     <form onSubmit={handleSubmit} className="max-w-md bg-white p-6 rounded shadow space-y-4">
//       <h2 className="text-2xl font-semibold">Registrar Terreno</h2>

//       {error && <p className="text-red-600 text-sm">{error}</p>}
//       {success && <p className="text-green-600 text-sm">{success}</p>}

//       <div>
//         <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre del terreno</label>
//         <input
//           type="text" id="name" name="name" value={form.name} onChange={handleChange}
//           className="w-full border px-3 py-2 rounded" required
//         />
//       </div>

//       <div>
//         <label htmlFor="area_m2" className="block text-sm font-medium mb-1">Área (m²)</label>
//         <input
//           type="number" id="area_m2" name="area_m2" step="0.01" value={form.area_m2} onChange={handleChange}
//           className="w-full border px-3 py-2 rounded" required
//         />
//       </div>

//       <div>
//         <label htmlFor="crop_type" className="block text-sm font-medium mb-1">Tipo de cultivo</label>
//         <input
//           type="text" id="crop_type" name="crop_type" value={form.crop_type} onChange={handleChange}
//           className="w-full border px-3 py-2 rounded" required
//         />
//       </div>

//       <div>
//         <label htmlFor="location" className="block text-sm font-medium mb-1">Ubicación</label>
//         <input
//           type="text" id="location" name="location" value={form.location} onChange={handleChange}
//           className="w-full border px-3 py-2 rounded" required
//         />
//       </div>

//       <div>
//         <label htmlFor="start_date" className="block text-sm font-medium mb-1">Fecha de inicio</label>
//         <input
//           type="date" id="start_date" name="start_date" value={form.start_date} onChange={handleChange}
//           className="w-full border px-3 py-2 rounded" required
//         />
//       </div>

//       <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
//         Guardar Terreno
//       </button>
//     </form>
//   );
// }
