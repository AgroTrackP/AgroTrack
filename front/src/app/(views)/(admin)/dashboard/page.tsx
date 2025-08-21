// src/app/(admin)/dashboard/page.tsx
import { KpiCard } from './components/kpi-card';
import { SalesChart } from './components/sales-chart';
import { RecentActivity } from './components/recent-activity';
import { Users, BarChart, Globe, Target } from 'lucide-react';
import { SubscriptionBreakdown } from './components/brackdowns';


// En una app real, estos datos vendrían de tu base de datos o API
async function getDashboardData() {
 return {
 kpis: [
 {
 title: 'Productores Activos',
 value: '450',
 icon: Users,
 },
 {
 title: 'Ingresos (MRR)',
 value: '$12,500',
 icon: BarChart,
 },
 {
 title: 'Hectáreas Gestionadas',
 value: '89,000 ha',
 icon: Globe,
 },
 {
 title: 'Nuevas Subs (30d)',
 value: '+25',
 icon: Target,
 },
 ],
 };
}


export default async function DashboardPage() {
 const data = await getDashboardData();


 return (
 <div className="space-y-6">
 {/* Sección de KPIs */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {data.kpis.map((kpi) => (
 <KpiCard
 key={kpi.title}
 title={kpi.title}
 value={kpi.value}
 icon={kpi.icon}
 />
 ))}
 </div>


 {/* Sección principal con gráfico de ventas y desglose de suscripciones */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 <SalesChart />
 <SubscriptionBreakdown />
 </div>


 {/* Sección de actividad reciente (ocupa todo el ancho en pantallas pequeñas) */}
 <div className="col-span-full">
 <RecentActivity />
 </div>
 </div>
 );
}