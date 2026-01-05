import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useDeleteProcessCatalog } from '@/hooks/useProcessCatalog';
import type { ProcessCatalogEntry } from '@/types';

interface ProcessCatalogTableProps {
  entries: ProcessCatalogEntry[];
  onEdit: (entry: ProcessCatalogEntry) => void;
}

export function ProcessCatalogTable({ entries, onEdit }: ProcessCatalogTableProps) {
  const deleteMutation = useDeleteProcessCatalog();

  const handleDelete = (id: string) => {
    if (confirm('Удалить эту запись из справочника?')) {
      deleteMutation.mutate(id);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Нет зарегистрированных программ
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Название программы</TableHead>
          <TableHead>Процессы</TableHead>
          <TableHead>Категория</TableHead>
          <TableHead>Обновлено</TableHead>
          <TableHead className="w-24">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="font-medium">{entry.friendly_name}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {entry.process_names.map((name, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {name}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              {entry.category ? (
                <Badge
                  variant="outline"
                  className="border"
                  style={{
                    backgroundColor: `${entry.category.color}20`,
                    borderColor: entry.category.color,
                    color: entry.category.color,
                  }}
                >
                  {entry.category.name}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  Не указана
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {format(new Date(entry.updated_at), 'dd.MM.yyyy', { locale: ru })}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(entry)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(entry.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
