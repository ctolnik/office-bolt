import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApplicationCategoriesTab } from '@/components/settings/ApplicationCategoriesTab';
import ProcessCatalog from './ProcessCatalog';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Настройки</h1>
        <p className="text-muted-foreground mt-1">
          Конфигурация системы мониторинга
        </p>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList>
          <TabsTrigger value="categories">Категории приложений</TabsTrigger>
          <TabsTrigger value="programs">Справочник программ</TabsTrigger>
          <TabsTrigger value="general" disabled>Общие</TabsTrigger>
          <TabsTrigger value="dlp" disabled>DLP правила</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <ApplicationCategoriesTab />
        </TabsContent>

        <TabsContent value="programs">
          <ProcessCatalog />
        </TabsContent>
      </Tabs>
    </div>
  );
}
