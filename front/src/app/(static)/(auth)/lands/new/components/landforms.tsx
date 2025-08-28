// "use client";

// import React, { useState, useEffect } from "react";
// import { useLands } from "@/context/landContext";
// import { useRouter } from "next/navigation";
// import { useAuthContext } from "@/context/authContext";

// export default function LandForm({ coords }: { coords: string }) {
//   const { user } = useAuthContext();
//   const { createLand, isLoading, error: landError } = useLands();
//   const router = useRouter();

//   useEffect(() => {
//     if (!user) {
//       router.push("/login");
//     }
//   }, [user, router]);

//   const [form, setForm] = useState({
//     name: "",
//     area_m2: "",
//     crop_type: "",
//     location: coords || "",
//     start_date: "",
//   });

//   const [success, setSuccess] = useState("");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSuccess("");

//     if (!user) return;

//     try {

//       await createLand(form);
//       setSuccess("Terreno registrado correctamente ✅");

//       // Reiniciamos el formulario usando los nombres de propiedad correctos
//       setForm({
//         name: "",
//         area_m2: "",
//         crop_type: "",
//         location: coords || "",
//         start_date: "",
//       });
//     } catch (err) {
//       console.error("Error al registrar terreno:", err);
//     }
//   };

//   if (!user) return null;

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4"
//     >
//       <h2 className="text-2xl font-semibold text-center">Registrar Terreno</h2>

//       {landError && <p className="text-red-600 text-sm">{landError}</p>}
//       {success && <p className="text-green-600 text-sm">{success}</p>}

//       <div>
//         <label htmlFor="name" className="block text-sm font-medium mb-1">
//           Nombre del cultivo
//         </label>
//         <input
//           type="text"
//           id="name"
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           className="w-full border px-3 py-2 rounded"
//           required
//         />
//       </div>

//       <div>
//         <label htmlFor="area_m2" className="block text-sm font-medium mb-1">
//           Área (m²)
//         </label>
//         <input
//           type="number"
//           id="area_m2"
//           name="area_m2"
//           step="0.01"
//           value={form.area_m2}
//           onChange={handleChange}
//           className="w-full border px-3 py-2 rounded"
//           required
//         />
//       </div>

//       <div>
//         <label htmlFor="crop_type" className="block text-sm font-medium mb-1">
//           Tipo de plantación
//         </label>
//         <input
//           type="text"
//           id="crop_type"
//           name="crop_type"
//           value={form.crop_type}
//           onChange={handleChange}
//           className="w-full border px-3 py-2 rounded"
//           required
//         />
//       </div>

//       <div>
//         <label htmlFor="location" className="block text-sm font-medium mb-1">
//           Ubicación
//         </label>
//         <input
//           type="text"
//           id="location"
//           name="location"
//           value={form.location}
//           onChange={handleChange}
//           className="w-full border px-3 py-2 rounded"
//           required
//         />
//       </div>

//       <div>
//         <label htmlFor="start_date" className="block text-sm font-medium mb-1">
//           Fecha de inicio
//         </label>
//         <input
//           type="date"
//           id="start_date"
//           name="start_date"
//           value={form.start_date}
//           onChange={handleChange}
//           className="w-full border px-3 py-2 rounded"
//           required
//         />
//       </div>

//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition disabled:opacity-50"
//       >
//         {isLoading ? "Guardando..." : "Guardar Terreno"}
//       </button>
//     </form>
//   );
// }



