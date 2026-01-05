import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useActivitySummary, useActivitySegments } from '@/hooks/useActivity';
import { useEmployees } from '@/hooks/useEmployees';
import { ActivitySummaryCards } from '@/components/activity/ActivitySummaryCards';
import { ActivityTimelineV2 } from '@/components/activity/ActivityTimelineV2';
import { TopProgramsTable } from '@/components/activity/TopProgramsTable';
import { ActivityFilters } from '@/components/activity/ActivityFilters';
import { ProductivityDistributionChart } from '@/components/activity/ProductivityDistributionChart';
import { ApplicationsChart } from '@/components/activity/ApplicationsChart';
import { ProductivityScoreWidget } from '@/components/activity/ProductivityScoreWidget';
import { CategoryLegend } from '@/components/activity/CategoryLegend';
import { DatabaseNotInitializedError } from '@/components/common/DatabaseNotInitializedError';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { exportActivityToPDF, exportActivityToExcel } from '@/utils/exportActivityUtils';
import { mockActivitySummary, generateMockSegments } from '@/utils/mockActivityData';

export default function ActivityReport() {
  const [selectedComputerName, setSelectedComputerName] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [useMockData, setUseMockData] = useState(false);
  
  const { data: employees } = useEmployees();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  
  const { data: summary, isLoading, error } = useActivitySummary(
    selectedComputerName, 
    dateStr
  );

  const { data: segments, isLoading: segmentsLoading } = useActivitySegments(
    selectedComputerName,
    dateStr,
    !!summary && !useMockData
  );

  // Use mock data if enabled or if there's a DATABASE_NOT_INITIALIZED error
  const displaySummary = useMockData ? mockActivitySummary : summary;
  const displaySegments = useMockData ? generateMockSegments(dateStr) : segments || [];
  
  // Check for DATABASE_NOT_INITIALIZED error
  const isDatabaseNotInitialized = error && (error as any).message === 'DATABASE_NOT_INITIALIZED';

  const handleExportPDF = () => {
    if (displaySummary) {
      exportActivityToPDF(displaySummary);
    }
  };

  const handleExportExcel = () => {
    if (displaySummary) {
      exportActivityToExcel(displaySummary);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Отчет активности</h1>
          <p className="text-muted-foreground mt-1">
            Детальная информация о работе сотрудника за день
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Mock data toggle for development */}
          <div className="flex items-center gap-2">
            <Switch
              id="mock-data"
              checked={useMockData}
              onCheckedChange={setUseMockData}
            />
            <Label htmlFor="mock-data" className="text-sm">
              Демо-данные
            </Label>
          </div>
          
          {displaySummary && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportExcel}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          )}
        </div>
      </div>

      <ActivityFilters
        employees={employees || []}
        selectedComputerName={selectedComputerName}
        selectedDate={selectedDate}
        onComputerNameChange={setSelectedComputerName}
        onDateChange={setSelectedDate}
      />

      {!selectedComputerName && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-center">
              Выберите сотрудника для просмотра отчета
            </p>
          </CardContent>
        </Card>
      )}

      {selectedComputerName && isLoading && !useMockData && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-64" />
          <Skeleton className="h-96" />
        </div>
      )}

      {selectedComputerName && isDatabaseNotInitialized && !useMockData && (
        <>
          <DatabaseNotInitializedError />
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Используйте переключатель "Демо-данные" для просмотра примера отчета.
            </AlertDescription>
          </Alert>
        </>
      )}

      {selectedComputerName && error && !isDatabaseNotInitialized && !useMockData && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ошибка при загрузке данных: {(error as any).message}
          </AlertDescription>
        </Alert>
      )}

      {selectedComputerName && displaySummary && (
        <div className="space-y-6">
          <ActivitySummaryCards summary={displaySummary} />
          
          {/* Productivity Score Widget */}
          {displaySummary.productivity_score !== undefined && (
            <ProductivityScoreWidget summary={displaySummary} />
          )}
          
          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2">
            <ApplicationsChart programs={displaySummary.top_programs} />
            {(displaySummary.productive_time || displaySummary.unproductive_time || displaySummary.neutral_time) && (
              <ProductivityDistributionChart summary={displaySummary} />
            )}
          </div>
          
          {/* Category Legend */}
          <CategoryLegend />
          
          {/* Timeline */}
          <ActivityTimelineV2 
            segments={displaySegments} 
            loading={segmentsLoading && !useMockData} 
          />
          
          {/* Detailed Table */}
          <TopProgramsTable 
            programs={displaySummary.top_programs} 
            activeSeconds={displaySummary.active_seconds} 
          />
        </div>
      )}

      {selectedComputerName && !isLoading && !error && !summary && !useMockData && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-center mb-4">
              За выбранную дату активность не зафиксирована
            </p>
            <Button
              variant="outline"
              onClick={() => setSelectedDate(new Date())}
            >
              Выбрать другую дату
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
