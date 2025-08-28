import { PlantationsClient } from './plantation-client';
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";


export default async function PlantationsPage() {
  const cookieStore = await cookies();
      const token = cookieStore.get("auth_token")?.value;
  
      if (!token) redirect("/login");
  
      try {
          const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
          const { payload } = await jwtVerify(token, secret);
  
          if (payload.role !== "Admin") redirect("/");
  
      } catch (err) {
          console.error("JWT verification failed:", err);
          redirect("/login");
      }
  
  return (
    <div>
      <PlantationsClient />
    </div>
  );
}