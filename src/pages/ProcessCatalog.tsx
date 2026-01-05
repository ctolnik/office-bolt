import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useProcessCatalog } from '@/hooks/useProcessCatalog';
import { ProcessCatalogTable } from '@/components/processCatalog/ProcessCatalogTable';
import { ProcessCatalogDialog } from '@/components/processCatalog/ProcessCatalogDialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProcessCatalogEntry } from '@/types';

export default function ProcessCatalog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ProcessCatalogEntry | null>(null);
  
  const { data: entries, isLoading } = useProcessCatalog();

  const handleEdit = (entry: ProcessCatalogEntry) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEntry(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Справочник программ</h1>
          <p className="text-muted-foreground mt-1">
            Управление соответствиями процессов и дружественных названий
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить программу
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Зарегистрированные программы</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : (
            <ProcessCatalogTable entries={entries || []} onEdit={handleEdit} />
          )}
        </CardContent>
      </Card>

      <ProcessCatalogDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        entry={editingEntry}
      />
    </div>
  );
}
