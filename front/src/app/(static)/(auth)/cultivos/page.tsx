import { Suspense } from "react";
import MisCultivosDetail from "./MisCultivosDetail"; 

export default function CultivosPage() {
  return (
    <Suspense fallback={<p>Cargando datos...</p>}>
      <MisCultivosDetail />
    </Suspense>
  );
}