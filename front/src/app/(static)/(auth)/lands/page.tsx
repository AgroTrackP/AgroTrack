"use client"

import LandForm from "@/app/(static)/(auth)/lands/new/components/landforms";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";


const MapComponent = dynamic(() => import("@/app/(static)/(auth)/lands/new/components/map"), { ssr: false });

export default function NewLandPage() {
    const [coords, setCoords] = useState("");
    const { user } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      if(!user) {
        router.push("/login")
      }
    }, [user, router]);

    if (!user) return null;

    return (
        <main className="min-h-screen flex flex-col gap-6 p-6 bg-gray-50">
    
      <LandForm coords={coords} />

      <div className="w-full">

        <MapComponent onLocationSelect={(newCoords) => setCoords(newCoords)} />
      </div>
    </main>
    )
}
