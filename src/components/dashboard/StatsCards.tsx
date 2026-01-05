import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const navigate = useNavigate();
  
  const productivityColor = 
    stats.avg_productivity >= 75 ? 'text-green-600' :
    stats.avg_productivity >= 50 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Сотрудники</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_employees}</div>
          <p className="text-xs text-muted-foreground mt-1">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {stats.active_now} активно
            </Badge>
          </p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => navigate('/alerts')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Алерты</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_alerts}</div>
          <p className="text-xs text-muted-foreground mt-1">
            <Badge 
              variant={stats.unresolved_alerts > 0 ? "destructive" : "outline"}
            >
              {stats.unresolved_alerts} не разрешено
            </Badge>
          </p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => navigate('/reports')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Продуктивность</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${productivityColor}`}>
            {Math.round(stats.avg_productivity)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Средний показатель
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">События сегодня</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="text-sm">
              <span className="font-medium">{stats.today_screenshots}</span> скриншотов
            </div>
            <div className="text-sm">
              <span className="font-medium">{stats.today_usb_events}</span> USB событий
            </div>
            <div className="text-sm">
              <span className="font-medium">{stats.today_file_events}</span> файловых операций
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
