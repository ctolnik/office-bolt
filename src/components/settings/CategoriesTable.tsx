import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { useUpdateCategory, useDeleteCategory } from '@/hooks/useSettings';
import { getCategoryBgClass, CATEGORY_LABELS } from '@/utils/categoryUtils';
import type { ApplicationCategory } from '@/types';

interface CategoriesTableProps {
  data: ApplicationCategory[];
  isLoading: boolean;
  selectedIds: string[];
  onSelectedChange: (ids: string[]) => void;
}

export function CategoriesTable({
  data,
  isLoading,
  selectedIds,
  onSelectedChange,
}: CategoriesTableProps) {
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectedChange(data.map((item) => item.id));
    } else {
      onSelectedChange([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectedChange([...selectedIds, id]);
    } else {
      onSelectedChange(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleCategoryChange = (id: string, category: string) => {
    updateCategory.mutate({ id, data: { category } });
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить это приложение из списка?')) {
      deleteCategory.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Приложения не найдены
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={selectedIds.length === data.length}
              onCheckedChange={handleSelectAll}
            />
          </TableHead>
          <TableHead>Название процесса</TableHead>
          <TableHead>Паттерн</TableHead>
          <TableHead>Категория</TableHead>
          <TableHead className="w-24">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <Checkbox
                checked={selectedIds.includes(item.id)}
                onCheckedChange={(checked) =>
                  handleSelectOne(item.id, checked as boolean)
                }
              />
            </TableCell>
            <TableCell className="font-medium">{item.process_name}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {item.process_pattern || '—'}
            </TableCell>
            <TableCell>
              <Select
                value={item.category}
                onValueChange={(value) => handleCategoryChange(item.id, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      <Badge className={getCategoryBgClass(key as any)}>
                        {label}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
