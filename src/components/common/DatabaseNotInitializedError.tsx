import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface DatabaseNotInitializedErrorProps {
  message?: string;
}

export function DatabaseNotInitializedError({ message }: DatabaseNotInitializedErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>База данных не инициализирована</AlertTitle>
      <AlertDescription>
        {message || 'База данных еще не готова. Обратитесь к администратору для запуска init.sql и инициализации материализованных представлений ClickHouse.'}
      </AlertDescription>
    </Alert>
  );
}
