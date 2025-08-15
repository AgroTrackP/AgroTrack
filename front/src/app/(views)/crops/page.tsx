"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import LandForm from "./components/landforms";
import { LandProvider } from "@/context/landContext";

// Import dinámico del mapa (SSR OFF) con nombre distinto
const MapClient = dynamic(() => import("./components/map"), { ssr: false });

export default function PageCrops() {
  const [coords, setCoords] = useState("");

  return (
    <LandProvider>
      <div className="m-8 p-8 border border-gray-200 rounded">
        <h2 className="text-xl font-bold mb-4 text-[#1b1a1a]">Perfil de Usuario</h2>

        <div
          className="p-6 rounded-xl shadow"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1568051775670-83722f73f3de?q=80&w=1089&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dos columnas: 1/2 y 1/2 (en desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-4">
              <LandForm coords={coords} />
            </div>

            <div className="bg-white rounded-xl p-2" style={{ minHeight: 400 }}>
              <MapClient onLocationSelect={(c: string) => setCoords(c)} />
            </div>
          </div>
        </div>
      </div>
    </LandProvider>
  );
}

