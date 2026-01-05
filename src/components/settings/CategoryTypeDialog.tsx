import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCreateCategoryType, useUpdateCategoryType } from '@/hooks/useCategoryTypes';
import type { CategoryType } from '@/types';

interface CategoryTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: CategoryType;
}

export function CategoryTypeDialog({ open, onOpenChange, category }: CategoryTypeDialogProps) {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [color, setColor] = useState('#6B7280');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateCategoryType();
  const updateMutation = useUpdateCategoryType();

  useEffect(() => {
    if (open && category) {
      setName(category.name);
      setKey(category.key);
      setColor(category.color || '#6B7280');
      setSortOrder(category.sort_order || 0);
      setIsActive(category.is_active);
    } else if (open) {
      setName('');
      setKey('');
      setColor('#6B7280');
      setSortOrder(0);
      setIsActive(true);
    }
    setErrors({});
  }, [open, category]);

  const validateKey = (value: string): boolean => {
    const keyRegex = /^[a-z0-9_-]+$/;
    if (!value) {
      setErrors(prev => ({ ...prev, key: 'Ключ обязателен' }));
      return false;
    }
    if (!keyRegex.test(value)) {
      setErrors(prev => ({ ...prev, key: 'Только a-z, 0-9, _, -' }));
      return false;
    }
    setErrors(prev => ({ ...prev, key: '' }));
    return true;
  };

  const validateName = (value: string): boolean => {
    if (!value || value.length < 2) {
      setErrors(prev => ({ ...prev, name: 'Минимум 2 символа' }));
      return false;
    }
    setErrors(prev => ({ ...prev, name: '' }));
    return true;
  };

  const handleNameChange = (value: string) => {
    setName(value);
    validateName(value);
    if (!category && !key) {
      const autoKey = value
        .toLowerCase()
        .replace(/[^a-z0-9а-я]/g, '_')
        .replace(/[а-я]/g, (char) => {
          const map: Record<string, string> = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
            'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
            'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
            'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
            'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
          };
          return map[char] || char;
        })
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
      setKey(autoKey);
      validateKey(autoKey);
    }
  };

  const handleKeyChange = (value: string) => {
    const lowerValue = value.toLowerCase();
    setKey(lowerValue);
    validateKey(lowerValue);
  };

  const handleSubmit = async () => {
    const isKeyValid = validateKey(key);
    const isNameValid = validateName(name);

    if (!isKeyValid || !isNameValid) {
      return;
    }

    const data = {
      name,
      key,
      color,
      sort_order: sortOrder,
      is_active: isActive,
    };

    try {
      if (category) {
        await updateMutation.mutateAsync({ id: category.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Редактировать категорию' : 'Создать категорию'}
          </DialogTitle>
          <DialogDescription>
            {category ? 'Измените параметры категории' : 'Добавьте новую категорию для классификации процессов'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Например: Продуктивная работа"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="key">Ключ *</Label>
            <Input
              id="key"
              value={key}
              onChange={(e) => handleKeyChange(e.target.value)}
              placeholder="productive"
              disabled={!!category}
            />
            <p className="text-xs text-muted-foreground">
              Только строчные латинские буквы, цифры, _ и -
            </p>
            {errors.key && (
              <p className="text-sm text-destructive">{errors.key}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Цвет</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#6B7280"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_order">Порядок сортировки</Label>
            <Input
              id="sort_order"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">
              Меньшее значение = выше в списке
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              Активна
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {category ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
