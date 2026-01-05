import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAlerts } from "@/hooks/useAlerts";
import { formatDate, getSeverityColor } from "@/utils/formatters";

export default function Alerts() {
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(false);
  const { data, isLoading } = useAlerts({ resolved: statusFilter });
  
  const alerts = data?.data || [];

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Алерты</h1>
          <p className="text-muted-foreground mt-1">
            Системные оповещения и предупреждения
          </p>
        </div>
        <Badge variant="destructive" className="text-lg px-4 py-2">
          {alerts.filter(a => !a.is_resolved).length} не разрешено
        </Badge>
      </div>

      <div className="flex gap-2">
        <Button
          variant={statusFilter === undefined ? "default" : "outline"}
          onClick={() => setStatusFilter(undefined)}
        >
          Все
        </Button>
        <Button
          variant={statusFilter === false ? "default" : "outline"}
          onClick={() => setStatusFilter(false)}
        >
          Не разрешено
        </Button>
        <Button
          variant={statusFilter === true ? "default" : "outline"}
          onClick={() => setStatusFilter(true)}
        >
          Разрешено
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Время</TableHead>
              <TableHead>Серьезность</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Сотрудник</TableHead>
              <TableHead>Компьютер</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead>Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!alerts.length ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Алерты не найдены
                </TableCell>
              </TableRow>
            ) : (
              alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>{formatDate(alert.timestamp, 'dd.MM.yyyy HH:mm')}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {getSeverityText(alert.severity)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {getAlertTypeText(alert.alert_type)}
                    </div>
                  </TableCell>
                  <TableCell>{alert.username}</TableCell>
                  <TableCell>{alert.computer_name}</TableCell>
                  <TableCell className="max-w-md truncate">{alert.description}</TableCell>
                  <TableCell>
                    <Badge variant={alert.is_resolved ? "secondary" : "destructive"}>
                      {alert.is_resolved ? 'Разрешено' : 'Не разрешено'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
