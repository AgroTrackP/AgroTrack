// src/app/(admin)/dashboard/page.tsx

// ...otras importaciones
import { MonthlyRevenueCard } from './components/MonthlyRevenueCard'; // <-- Importamos la nueva tarjeta
import { SalesChart } from './components/sales-chart';
import { SubscriptionBreakdown } from './components/brackdowns';
import { RecentActivity } from './components/recent-activity';
import { ActiveProducersCard } from './components/activeProducerCard';
import { ManagedHectaresCard } from './components/managedHectaresCard';
import { NewSubscriptionsCard } from './components/newsuscriptions';

// ...

export default async function DashboardPage() {
  // ...

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