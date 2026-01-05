import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { formatDuration } from './formatters';
import type { DailyActivitySummary } from '@/types';

export function exportActivityToPDF(summary: DailyActivitySummary) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(16);
  doc.text(`Отчет активности - ${summary.username}`, 14, 20);
  
  doc.setFontSize(12);
  doc.text(`Дата: ${summary.date}`, 14, 30);
  doc.text(`Компьютер: ${summary.computer_name}`, 14, 37);
  
  // Summary
  doc.setFontSize(14);
  doc.text('Сводка:', 14, 50);
  
  doc.setFontSize(11);
  doc.text(`Активность: ${formatDuration(summary.active_seconds)}`, 14, 60);
  doc.text(`Простой: ${formatDuration(summary.idle_seconds)}`, 14, 67);
  doc.text(`Отсутствие: ${formatDuration(summary.offline_seconds)}`, 14, 74);
  
  // Top Programs
  doc.setFontSize(14);
  doc.text('Топ программ:', 14, 90);
  
  doc.setFontSize(10);
  let yPos = 100;
  summary.top_programs.forEach((program, index) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(
      `${index + 1}. ${program.friendly_name} - ${formatDuration(program.duration_sec)}`,
      14,
      yPos
    );
    yPos += 7;
  });
  
  doc.save(`activity-report-${summary.username}-${summary.date}.pdf`);
}

export function exportActivityToExcel(summary: DailyActivitySummary) {
  // Summary sheet
  const summaryData = [
    ['Отчет активности'],
    ['Дата', summary.date],
    ['Сотрудник', summary.username],
    ['Компьютер', summary.computer_name],
    [],
    ['Метрика', 'Значение'],
    ['Активность', formatDuration(summary.active_seconds)],
    ['Простой', formatDuration(summary.idle_seconds)],
    ['Отсутствие', formatDuration(summary.offline_seconds)],
  ];
  
  // Programs sheet
  const programsData = [
    ['#', 'Программа', 'Процесс', 'Время работы (сек)', 'Время работы'],
    ...summary.top_programs.map((program, index) => [
      index + 1,
      program.friendly_name,
      program.process_name,
      program.duration_sec,
      formatDuration(program.duration_sec),
    ]),
  ];
  
  const wb = XLSX.utils.book_new();
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  const wsPrograms = XLSX.utils.aoa_to_sheet(programsData);
  
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Сводка');
  XLSX.utils.book_append_sheet(wb, wsPrograms, 'Программы');
  
  XLSX.writeFile(wb, `activity-report-${summary.username}-${summary.date}.xlsx`);
}
