import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { DailyReport } from '@/types';
import { formatDate, formatDuration, formatFileSize } from './formatters';

export const exportDailyReportToPDF = async (report: DailyReport) => {
  const element = document.getElementById('daily-report-content');
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = pdfHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
  heightLeft -= pdf.internal.pageSize.getHeight();

  while (heightLeft > 0) {
    position = heightLeft - pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();
  }

  pdf.save(`report_${report.username}_${report.date}.pdf`);
};

export const exportTableToExcel = (data: any[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportApplicationsToExcel = (report: DailyReport) => {
  const data = report.applications.map(app => ({
    'Приложение': app.process_name,
    'Заголовок окна': app.window_title,
    'Длительность': formatDuration(app.duration),
    'Количество запусков': app.count,
    'Категория': app.category,
    'Процент времени': `${app.percentage.toFixed(1)}%`,
  }));
  
  exportTableToExcel(data, `applications_${report.username}_${report.date}`);
};

export const exportFileEventsToExcel = (report: DailyReport) => {
  const data = report.file_events.map(event => ({
    'Время': formatDate(event.timestamp),
    'Тип операции': event.event_type === 'copy' ? 'Копирование' : 
                     event.event_type === 'move' ? 'Перемещение' : 'Удаление',
    'Исходный путь': event.source_path,
    'Целевой путь': event.destination_path || '-',
    'Размер файла': formatFileSize(event.file_size),
    'DLP Alert': event.is_dlp_alert ? 'ДА' : 'Нет',
  }));
  
  exportTableToExcel(data, `file_events_${report.username}_${report.date}`);
};

export const exportUSBEventsToExcel = (report: DailyReport) => {
  const data = report.usb_events.map(event => ({
    'Время': formatDate(event.timestamp),
    'Тип события': event.event_type === 'connected' ? 'Подключено' : 'Отключено',
    'Устройство': event.device_name,
    'ID устройства': event.device_id,
    'Имя тома': event.volume_name || '-',
  }));
  
  exportTableToExcel(data, `usb_events_${report.username}_${report.date}`);
};

export const printReport = () => {
  window.print();
};
