import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileEvent } from '@/types';
import { formatDate, formatFileSize } from '@/utils/formatters';
import { FileText, AlertTriangle } from 'lucide-react';

interface FileEventsTableProps {
  events: FileEvent[];
  compact?: boolean;
}

export default function FileEventsTable({ events, compact = false }: FileEventsTableProps) {
  const getEventTypeLabel = (type: string) => {
    const labels = {
      copy: 'Копирование',
      move: 'Перемещение',
      delete: 'Удаление',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const content = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Время</TableHead>
          <TableHead>Тип операции</TableHead>
          <TableHead>Исходный путь</TableHead>
          <TableHead>Целевой путь</TableHead>
          <TableHead>Размер</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event, index) => (
          <TableRow
            key={index}
            className={event.is_dlp_alert ? 'bg-red-50 border-l-4 border-red-500' : ''}
          >
            <TableCell className={event.is_dlp_alert ? 'font-bold' : ''}>
              {event.is_dlp_alert && (
                <Badge variant="destructive" className="mr-2">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  DLP
                </Badge>
              )}
              {formatDate(event.timestamp)}
            </TableCell>
            <TableCell className={event.is_dlp_alert ? 'font-bold' : ''}>
              <Badge variant={event.event_type === 'delete' ? 'destructive' : 'secondary'}>
                {getEventTypeLabel(event.event_type)}
              </Badge>
            </TableCell>
            <TableCell className={event.is_dlp_alert ? 'font-bold font-mono text-xs' : 'font-mono text-xs'}>
              {event.source_path}
            </TableCell>
            <TableCell className={event.is_dlp_alert ? 'font-bold font-mono text-xs' : 'font-mono text-xs'}>
              {event.destination_path || '-'}
            </TableCell>
            <TableCell className={event.is_dlp_alert ? 'font-bold' : ''}>
              {formatFileSize(event.file_size)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (compact) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Файловые операции{' '}
          <span className="text-muted-foreground">({events.length})</span>
          {events.some(e => e.is_dlp_alert) && (
            <Badge variant="destructive" className="ml-2">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {events.filter(e => e.is_dlp_alert).length} DLP Alert
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Нет файловых операций для отображения
          </p>
        ) : (
          content
        )}
      </CardContent>
    </Card>
  );
}
