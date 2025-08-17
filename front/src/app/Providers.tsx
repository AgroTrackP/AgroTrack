"use client";

import { AuthProvider } from "@/context/authContext";
import { Auth0Provider } from "@auth0/auth0-react";
import RoutesProtection from "@/hooks/routesProtection";

export function Providers({ children }: { children: React.ReactNode }) {
  // const redirectUri = process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI || "";
  const redirectUri = 
      process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI ||
    (typeof window !== "undefined" ? window.location.origin : "");
  return (
    <Auth0Provider
    domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
    clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
    authorizationParams={{
      redirect_uri: redirectUri,
    }}
    >
      <AuthProvider>
      <RoutesProtection>
        {children}
    </RoutesProtection>
      </AuthProvider>
    </Auth0Provider>
  );
}