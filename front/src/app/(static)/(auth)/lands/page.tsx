"use client"

import LandForm from "@/app/(static)/(auth)/lands/new/components/landforms";
import dynamic from "next/dynamic";
import { useState } from "react";

const MapComponent = dynamic(() => import("@/app/(static)/(auth)/lands/new/components/map"), { ssr: false });

export default function NewLandPage() {
    const [coords, setCoords] = useState("");

    return (
        <main className="min-h-screen flex flex-col gap-6 p-6 bg-gray-50">
     
      <LandForm coords={coords} />

      <div className="w-full">

        <MapComponent onLocationSelect={(newCoords) => setCoords(newCoords)} />
      </div>
    </main>
    )
}
