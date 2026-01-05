import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { formatRelativeTime, getStatusColor } from "@/utils/formatters";
import type { Agent } from "@/types";

interface ActiveAgentsWidgetProps {
  agents: Agent[];
}

export function ActiveAgentsWidget({ agents }: ActiveAgentsWidgetProps) {
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Онлайн';
      case 'offline': return 'Оффлайн';
      case 'idle': return 'Простой';
      default: return status;
    }
  };

  const handleAgentClick = (agent: Agent) => {
    navigate(`/reports?username=${agent.username}&date=${today}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Активные агенты
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {!Array.isArray(agents) || agents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Нет активных агентов
            </p>
          ) : (
            agents.slice(0, 5).map((agent) => (
              <div
                key={agent.computer_name}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                onClick={() => handleAgentClick(agent)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(agent.status)}>
                      {getStatusText(agent.status)}
                    </Badge>
                    <p className="font-medium text-sm truncate">
                      {agent.computer_name}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {agent.username}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeTime(agent.last_seen)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
