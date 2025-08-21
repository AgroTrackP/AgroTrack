"use client";

import React from "react";

import { LandProvider } from "@/context/landContext";
import LandForm from "./components/landforms";

export default function PageCrops() {
  return (
    <LandProvider>
      <div className="m-8 p-8 border border-gray-200 rounded">
        <h2 className="text-xl font-bold mb-4 text-[#1b1a1a]">Registro de Cultivo</h2>

        <div
          className="p-6 rounded-xl shadow"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1568051775670-83722f73f3de?q=80&w=1089&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-1">
            <div className="bg-white rounded-xl p-4">
              <LandForm/>
            </div>
          </div>
        </div>
      </div>
    </LandProvider>
  );
}