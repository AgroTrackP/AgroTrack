"use client";

import React from "react";
import UserData from "./components/userData";
import TerrainInformation from "./components/terrainInformation";
import UserSuscription from "./components/userSuscription";

const PageProfile = () => {
  return (
    <div className="m-24 p-8 border border-gray-200 rounded-lg bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
        Perfil de Usuario
      </h2>

      <div
        className="mb-8 rounded-xl p-8 shadow-md bg-cover bg-center text-black"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1568051775670-83722f73f3de?q=80&w=1089&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <UserData /> {/* ✅ UserData ahora contiene la lógica de edición */}
      </div>

      <div className="mb-12">
        <h3 className="text-xl font-semibold text-gray-700 mb-6">
          Gestión de Terrenos
        </h3>
        <div className="w-full">
          <TerrainInformation />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Información del Plan
          </h3>
            <div>

                
            </div>
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <UserSuscription/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageProfile;
