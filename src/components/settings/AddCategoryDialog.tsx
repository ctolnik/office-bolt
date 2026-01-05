import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateCategory } from '@/hooks/useSettings';
import { CATEGORY_LABELS } from '@/utils/categoryUtils';

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCategoryDialog({ open, onOpenChange }: AddCategoryDialogProps) {
  const [processName, setProcessName] = useState('');
  const [processPattern, setProcessPattern] = useState('');
  const [category, setCategory] = useState('neutral');

  const createCategory = useCreateCategory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createCategory.mutate(
      {
        process_name: processName,
        process_pattern: processPattern || undefined,
        category: category as any,
      },
      {
        onSuccess: () => {
          setProcessName('');
          setProcessPattern('');
          setCategory('neutral');
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить приложение</DialogTitle>
          <DialogDescription>
            Добавьте новое приложение и укажите его категорию для расчёта продуктивности
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="process_name">Название процесса *</Label>
              <Input
                id="process_name"
                placeholder="chrome.exe"
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Точное название исполняемого файла
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="process_pattern">Паттерн (опционально)</Label>
              <Input
                id="process_pattern"
                placeholder="chrome*"
                value={processPattern}
                onChange={(e) => setProcessPattern(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Wildcard паттерн для группы приложений (*, ?)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Категория *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={createCategory.isPending}>
              Добавить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
