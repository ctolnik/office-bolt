import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useCategoryTypes } from '@/hooks/useCategoryTypes';
import { CategoryTypeDialog } from './CategoryTypeDialog';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';
import type { CategoryType } from '@/types';

export function ApplicationCategoriesTab() {
  const [search, setSearch] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | undefined>();
  const [deletingCategory, setDeletingCategory] = useState<CategoryType | null>(null);

  const { data: categories, isLoading } = useCategoryTypes();

  const filteredCategories = categories?.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.key.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    const orderA = a.sort_order ?? 999;
    const orderB = b.sort_order ?? 999;
    return orderA - orderB;
  });

  const handleEdit = (category: CategoryType) => {
    setEditingCategory(category);
  };

  const handleDelete = (category: CategoryType) => {
    setDeletingCategory(category);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Категории</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Справочник категорий для классификации процессов
            </p>
          </div>
          <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить категорию
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Поиск по названию или ключу..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : sortedCategories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {search ? 'Категории не найдены' : 'Нет созданных категорий'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Ключ</TableHead>
                <TableHead>Цвет</TableHead>
                <TableHead>Порядок</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-24">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{category.key}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: category.color || '#6B7280' }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {category.color || '#6B7280'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{category.sort_order ?? 0}</TableCell>
                  <TableCell>
                    {category.is_active ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Активна
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                        Неактивна
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <CategoryTypeDialog
          open={isCreateDialogOpen || !!editingCategory}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateDialogOpen(false);
              setEditingCategory(undefined);
            }
          }}
          category={editingCategory}
        />

        <DeleteCategoryDialog
          open={!!deletingCategory}
          onOpenChange={(open) => {
            if (!open) setDeletingCategory(null);
          }}
          category={deletingCategory}
        />
      </CardContent>
    </Card>
  );
}
