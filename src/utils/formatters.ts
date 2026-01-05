import { format, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Format duration in seconds to HH:MM:SS
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return [hours, minutes, secs]
    .map(v => v.toString().padStart(2, '0'))
    .join(':');
}

// IMPROVEMENT: [FRONTEND_IMPROVEMENTS_SPEC] - Short duration format for charts
// Date: 2025-10-30
// Related to: Section 12.5 - Improved readability for time distribution charts
export function formatDurationShort(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}с`;
  } else if (seconds < 3600) {
    const minutes = Math.round(seconds / 60);
    return `${minutes}м`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return minutes > 0 ? `${hours}ч ${minutes}м` : `${hours}ч`;
  }
}

// Format date with locale
export function formatDate(date: string | Date, formatStr: string = 'dd.MM.yyyy HH:mm'): string {
  return format(new Date(date), formatStr, { locale: ru });
}

// Format relative time
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { 
    addSuffix: true, 
    locale: ru 
  });
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

// Get severity color class
export function getSeverityColor(severity: string): string {
  const colors = {
    critical: 'text-red-600 bg-red-50 border-red-200',
    high: 'text-orange-600 bg-orange-50 border-orange-200',
    medium: 'text-amber-600 bg-amber-50 border-amber-200',
    low: 'text-blue-600 bg-blue-50 border-blue-200',
  };
  return colors[severity as keyof typeof colors] || colors.low;
}

// Get status color class
export function getStatusColor(status: string): string {
  const colors = {
    online: 'text-category-productive bg-category-productive/10',
    offline: 'text-category-neutral bg-category-neutral/10',
    idle: 'text-category-entertainment bg-category-entertainment/10',
  };
  return colors[status as keyof typeof colors] || colors.offline;
}
