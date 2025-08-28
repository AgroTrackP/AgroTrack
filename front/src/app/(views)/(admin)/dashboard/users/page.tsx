// src/app/(admin)/dashboard/users/page.tsx

// 1. IMPORTA EL TIPO Y EL COMPONENTE
import { UsersClient } from './components/user-client';
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";


export default async function UsersPage() {
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
    <div className="space-y-6">
     

      <UsersClient/>
    </div>
  );
}