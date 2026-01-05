import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Download, Upload } from 'lucide-react';
import { useApplicationCategories, useBulkUpdateCategories } from '@/hooks/useSettings';
import { CategoriesTable } from './CategoriesTable';
import { AddCategoryDialog } from './AddCategoryDialog';
import { CategoryFilter } from './CategoryFilter';

export function ApplicationCategoriesTab() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data, isLoading } = useApplicationCategories({ search, category: categoryFilter[0] });
  const bulkUpdate = useBulkUpdateCategories();

  const handleBulkUpdate = (category: string) => {
    bulkUpdate.mutate({ ids: selectedIds, category });
    setSelectedIds([]);
  };

  const handleExport = () => {
    // TODO: Implement export
    console.log('Export clicked');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Категории приложений</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Импорт
            </Button>
            <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить приложение
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Поиск по названию приложения..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <CategoryFilter
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
        </div>

        {selectedIds.length > 0 && (
          <div className="mb-4 p-3 bg-muted rounded-lg flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Выбрано: {selectedIds.length}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const category = prompt('Введите категорию (productive, unproductive, neutral, communication, system):');
                if (category) handleBulkUpdate(category);
              }}
            >
              Изменить категорию
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedIds([])}
            >
              Отменить выбор
            </Button>
          </div>
        )}

        <CategoriesTable
          data={data?.data || []}
          isLoading={isLoading}
          selectedIds={selectedIds}
          onSelectedChange={setSelectedIds}
        />

        <AddCategoryDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </CardContent>
    </Card>
  );
}
