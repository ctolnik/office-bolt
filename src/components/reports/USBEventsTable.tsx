import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { USBEvent, FileEvent } from '@/types';
import { formatDate } from '@/utils/formatters';
import { Usb, ExternalLink } from 'lucide-react';
import FileEventsTable from './FileEventsTable';

interface USBEventsTableProps {
  events: USBEvent[];
  fileEvents: FileEvent[];
}

export default function USBEventsTable({ events, fileEvents }: USBEventsTableProps) {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openFilesModal = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setIsModalOpen(true);
  };

  const filteredFileEvents = selectedDevice
    ? fileEvents.filter((fe) => fe.destination_path?.includes(selectedDevice))
    : [];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Usb className="h-5 w-5" />
            USB События <span className="text-muted-foreground">({events.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Время</TableHead>
                <TableHead>Тип события</TableHead>
                <TableHead>Устройство</TableHead>
                <TableHead>ID устройства</TableHead>
                <TableHead>Имя тома</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(event.timestamp)}</TableCell>
                  <TableCell>
                    <Badge variant={event.event_type === 'connected' ? 'default' : 'secondary'}>
                      {event.event_type === 'connected' ? 'Подключено' : 'Отключено'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{event.device_name}</TableCell>
                  <TableCell className="font-mono text-xs">{event.device_id}</TableCell>
                  <TableCell>{event.volume_name || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openFilesModal(event.device_id)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Скопированные файлы
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {events.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Нет USB событий для отображения
            </p>
          )}
        </CardContent>
      </Card>

      {/* Files Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Файлы скопированные на устройство</DialogTitle>
            <DialogDescription className="sr-only">
              Список файлов скопированных на USB устройство
            </DialogDescription>
          </DialogHeader>
          <FileEventsTable events={filteredFileEvents} compact />
        </DialogContent>
      </Dialog>
    </>
  );
}
