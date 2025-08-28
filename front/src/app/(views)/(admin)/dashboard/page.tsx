// src/app/(admin)/dashboard/page.tsx
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

import { MonthlyRevenueCard } from './components/MonthlyRevenueCard';
import { SalesChart } from './components/sales-chart';
import { SubscriptionBreakdown } from './components/brackdowns';
import { RecentActivity } from './components/recent-activity';
import { ActiveProducersCard } from './components/activeProducerCard';
import { ManagedHectaresCard } from './components/managedHectaresCard';
import { NewSubscriptionsCard } from './components/newsuscriptions';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/login");

    try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== "Admin") redirect("/"); // Si no es Admin, redirige al home
} catch (err) {
    console.error("JWT verification failed:", err);
    redirect("/login"); // Si el token es inválido, redirige al login
}

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ActiveProducersCard/>
                <MonthlyRevenueCard />
                <ManagedHectaresCard />
                <NewSubscriptionsCard />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SalesChart />
                <SubscriptionBreakdown />
            </div>
            <div className="col-span-full">
                <RecentActivity />
            </div>
        </div>
    );
}
