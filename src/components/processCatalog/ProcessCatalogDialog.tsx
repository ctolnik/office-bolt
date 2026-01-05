import { useEffect, useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useCreateProcessCatalog, useUpdateProcessCatalog } from '@/hooks/useProcessCatalog';
import { useCategoryTypes } from '@/hooks/useCategoryTypes';
import type { ProcessCatalogEntry } from '@/types';

interface ProcessCatalogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: ProcessCatalogEntry | null;
}

export function ProcessCatalogDialog({ open, onOpenChange, entry }: ProcessCatalogDialogProps) {
  const [friendlyName, setFriendlyName] = useState('');
  const [processNames, setProcessNames] = useState<string[]>([]);
  const [processInput, setProcessInput] = useState('');
  const [windowPatterns, setWindowPatterns] = useState<string[]>([]);
  const [patternInput, setPatternInput] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const createMutation = useCreateProcessCatalog();
  const updateMutation = useUpdateProcessCatalog();
  const { data: categories } = useCategoryTypes();

  const activeCategories = categories?.filter(c => c.is_active) || [];

  useEffect(() => {
    if (entry) {
      setFriendlyName(entry.friendly_name);
      setProcessNames(entry.process_names);
      setWindowPatterns(entry.window_title_patterns);
      setCategoryId(entry.category_id);
    } else {
      setFriendlyName('');
      setProcessNames([]);
      setWindowPatterns([]);
      setCategoryId('');
    }
  }, [entry, open]);

  const handleAddProcess = () => {
    if (processInput.trim()) {
      setProcessNames([...processNames, processInput.trim()]);
      setProcessInput('');
    }
  };

  const handleRemoveProcess = (index: number) => {
    setProcessNames(processNames.filter((_, i) => i !== index));
  };

  const handleAddPattern = () => {
    if (patternInput.trim()) {
      setWindowPatterns([...windowPatterns, patternInput.trim()]);
      setPatternInput('');
    }
  };

  const handleRemovePattern = (index: number) => {
    setWindowPatterns(windowPatterns.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!friendlyName.trim() || processNames.length === 0 || !categoryId) {
      return;
    }

    const data = {
      friendly_name: friendlyName,
      process_names: processNames,
      window_title_patterns: windowPatterns,
      category_id: categoryId,
    };

    if (entry) {
      updateMutation.mutate(
        { id: entry.id, data },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {entry ? 'Редактировать программу' : 'Добавить программу'}
          </DialogTitle>
          <DialogDescription>
            Укажите дружественное название и процессы, которые относятся к этой программе
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="friendly_name">Название программы *</Label>
              <Input
                id="friendly_name"
                placeholder="Google Chrome"
                value={friendlyName}
                onChange={(e) => setFriendlyName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="process_names">Процессы *</Label>
              <div className="flex gap-2">
                <Input
                  id="process_names"
                  placeholder="chrome.exe"
                  value={processInput}
                  onChange={(e) => setProcessInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProcess())}
                />
                <Button type="button" onClick={handleAddProcess}>
                  Добавить
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {processNames.map((name, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1">
                    {name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveProcess(idx)}
                    />
                  </Badge>
                ))}
              </div>
              {processNames.length === 0 && (
                <p className="text-xs text-destructive">Добавьте хотя бы один процесс</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="window_patterns">Паттерны заголовков окон</Label>
              <div className="flex gap-2">
                <Input
                  id="window_patterns"
                  placeholder="*mail.yandex.ru*"
                  value={patternInput}
                  onChange={(e) => setPatternInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPattern())}
                />
                <Button type="button" onClick={handleAddPattern}>
                  Добавить
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {windowPatterns.map((pattern, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1">
                    {pattern}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemovePattern(idx)}
                    />
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Используйте * для wildcard matching
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Категория *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {activeCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: cat.color || '#6B7280' }}
                        />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {activeCategories.length === 0 && (
                <p className="text-xs text-amber-600">
                  Нет активных категорий. Добавьте их в настройках.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={
                !friendlyName.trim() ||
                processNames.length === 0 ||
                !categoryId ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {entry ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
