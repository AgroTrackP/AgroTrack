'use client';

import { Loader2 } from "lucide-react";

export function OverlayLoader({ message = "Cargando..." }: { message?: string }) {
  return (
    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="mt-2 text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
}
