import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, Printer } from 'lucide-react';
import { DailyReport } from '@/types';
import { 
  exportDailyReportToPDF, 
  exportApplicationsToExcel,
  exportFileEventsToExcel,
  exportUSBEventsToExcel,
  printReport 
} from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonsProps {
  report: DailyReport;
}

export default function ExportButtons({ report }: ExportButtonsProps) {
  const { toast } = useToast();

  const handlePDFExport = async () => {
    try {
      await exportDailyReportToPDF(report);
      toast({
        title: 'Успешно',
        description: 'Отчет экспортирован в PDF',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось экспортировать отчет',
        variant: 'destructive',
      });
    }
  };

  const handleExcelExport = (type: 'applications' | 'files' | 'usb') => {
    try {
      if (type === 'applications') {
        exportApplicationsToExcel(report);
      } else if (type === 'files') {
        exportFileEventsToExcel(report);
      } else {
        exportUSBEventsToExcel(report);
      }
      toast({
        title: 'Успешно',
        description: 'Данные экспортированы в Excel',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось экспортировать данные',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={handlePDFExport} variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Экспорт в PDF
      </Button>
      <Button onClick={() => handleExcelExport('applications')} variant="outline">
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Excel: Приложения
      </Button>
      <Button onClick={() => handleExcelExport('files')} variant="outline">
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Excel: Файлы
      </Button>
      <Button onClick={() => handleExcelExport('usb')} variant="outline">
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Excel: USB
      </Button>
      <Button onClick={printReport} variant="outline">
        <Printer className="mr-2 h-4 w-4" />
        Печать
      </Button>
    </div>
  );
}
