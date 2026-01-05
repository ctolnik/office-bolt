import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/types';
import { formatDate, getSeverityColor } from '@/utils/formatters';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface DLPAlertsSectionProps {
  alerts: Alert[];
}

export default function DLPAlertsSection({ alerts }: DLPAlertsSectionProps) {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-green-600" />
            DLP Алерты
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Нет DLP алертов за выбранный период
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-500 border-2">
      <CardHeader className="bg-red-50">
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          DLP Алерты <Badge variant="destructive">{alerts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="destructive" className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{alert.alert_type}</Badge>
                  </div>
                  
                  <h4 className="font-bold text-red-900 mb-1">{alert.description}</h4>
                  
                  <div className="text-sm text-red-800 space-y-1">
                    <p>
                      <span className="font-medium">Компьютер:</span> {alert.computer_name}
                    </p>
                    <p>
                      <span className="font-medium">Пользователь:</span> {alert.username}
                    </p>
                    <p>
                      <span className="font-medium">Время:</span> {formatDate(alert.timestamp)}
                    </p>
                  </div>

                  {alert.details && typeof alert.details === 'object' && Object.keys(alert.details).length > 0 && (
                    <div className="mt-3 p-2 bg-white rounded text-xs font-mono">
                      <pre>{JSON.stringify(alert.details, null, 2)}</pre>
                    </div>
                  )}
                </div>

                {alert.is_resolved && (
                  <Badge variant="outline" className="bg-white">
                    Разрешено
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
