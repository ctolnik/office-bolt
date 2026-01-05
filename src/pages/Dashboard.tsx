import { StatsCards } from "@/components/dashboard/StatsCards";
import { ActiveAgentsWidget } from "@/components/dashboard/ActiveAgentsWidget";
import { AlertsWidget } from "@/components/dashboard/AlertsWidget";
import { ProductivityTrendChart } from "@/components/dashboard/ProductivityTrendChart";
import { useDashboardStats, useActiveAgents } from "@/hooks/useDashboard";
import { useUnresolvedAlerts } from "@/hooks/useAlerts";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activeAgents, isLoading: agentsLoading } = useActiveAgents();
  const { data: unresolvedAlerts, isLoading: alertsLoading } = useUnresolvedAlerts();

  if (statsLoading || agentsLoading || alertsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="text-muted-foreground mt-1">
          Обзор системы мониторинга
        </p>
      </div>

      {stats && <StatsCards stats={stats} />}

      <div className="grid gap-6 md:grid-cols-2">
        {activeAgents && <ActiveAgentsWidget agents={activeAgents} />}
        {unresolvedAlerts && <AlertsWidget alerts={unresolvedAlerts} />}
      </div>

      <ProductivityTrendChart />
    </div>
  );
}
