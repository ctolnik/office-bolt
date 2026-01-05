import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileText, AlertCircle } from 'lucide-react';
import ReportFilters from '@/components/reports/ReportFilters';
import DailyReportView from '@/components/reports/DailyReportView';
import { useReports } from '@/hooks/useReports';

export default function Reports() {
  const [selectedUsername, setSelectedUsername] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { useDailyReport } = useReports();

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const { data: report, isLoading, error } = useDailyReport(
    selectedUsername,
    formattedDate,
    !!selectedUsername
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Отчеты</h1>
        <p className="text-muted-foreground mt-1">
          Детальные отчеты по активности сотрудников
        </p>
      </div>

      <ReportFilters
        selectedUsername={selectedUsername}
        selectedDate={selectedDate}
        onUsernameChange={setSelectedUsername}
        onDateChange={setSelectedDate}
      />

      {!selectedUsername && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Выберите сотрудника</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Выберите сотрудника и дату для просмотра детального отчета по активности
            </p>
          </CardContent>
        </Card>
      )}

      {selectedUsername && isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-16 w-16 text-muted-foreground animate-spin mb-4" />
            <h3 className="text-lg font-semibold mb-2">Загрузка отчета...</h3>
            <p className="text-muted-foreground text-center">
              Пожалуйста, подождите
            </p>
          </CardContent>
        </Card>
      )}

      {selectedUsername && error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ошибка загрузки отчета: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {selectedUsername && report && !isLoading && (
        <DailyReportView report={report} />
      )}
    </div>
  );
}
