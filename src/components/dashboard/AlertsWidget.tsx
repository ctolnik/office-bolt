import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate, getSeverityColor } from "@/utils/formatters";
import type { Alert } from "@/types";

interface AlertsWidgetProps {
  alerts: Alert[];
}

export function AlertsWidget({ alerts }: AlertsWidgetProps) {
  const navigate = useNavigate();

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical': return 'Критический';
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return severity;
    }
  };

  const getAlertTypeText = (type: string) => {
    switch (type) {
      case 'dlp': return 'DLP';
      case 'suspicious_activity': return 'Подозрительная активность';
      case 'policy_violation': return 'Нарушение политики';
      default: return type;
    }
  };

  const handleAlertClick = (alert: Alert) => {
    navigate(`/alerts?id=${alert.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Последние алерты
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {!Array.isArray(alerts) || alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Нет неразрешенных алертов
            </p>
          ) : (
            alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleAlertClick(alert)}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge className={getSeverityColor(alert.severity)}>
                    {getSeverityText(alert.severity)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(alert.timestamp, 'dd.MM HH:mm')}
                  </span>
                </div>
                <p className="text-sm font-medium mb-1">{getAlertTypeText(alert.alert_type)}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {alert.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {alert.username} • {alert.computer_name}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
