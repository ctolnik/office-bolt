// IMPROVEMENT: [FRONTEND_IMPROVEMENTS_SPEC] - Enhanced error display component
// Date: 2025-10-30
// Related to: Section 2.2 - Improved ErrorMessage component

import { AlertCircle, WifiOff, Lock, Server, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import axios from 'axios';

interface ErrorMessageProps {
  error: Error | unknown | null;
  title?: string;
  retry?: () => void;
  showContactSupport?: boolean;
}

export function ErrorMessage({ 
  error, 
  title, 
  retry,
  showContactSupport = false 
}: ErrorMessageProps) {
  const getErrorDetails = () => {
    if (!error) {
      return {
        icon: AlertCircle,
        title: title || 'Произошла ошибка',
        message: 'Неизвестная ошибка',
        variant: 'destructive' as const,
      };
    }

    // Check if it's an Axios error
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      
      if (status === 404) {
        return {
          icon: AlertCircle,
          title: 'Ресурс не найден',
          message: 'Запрашиваемые данные отсутствуют или были удалены.',
          variant: 'default' as const,
        };
      }
      
      if (status === 403) {
        return {
          icon: Lock,
          title: 'Доступ запрещён',
          message: 'У вас нет прав для доступа к этому ресурсу. Проверьте API ключ или обратитесь к администратору.',
          variant: 'destructive' as const,
        };
      }
      
      if (status === 401) {
        return {
          icon: Lock,
          title: 'Требуется авторизация',
          message: 'Необходимо войти в систему для доступа к этому ресурсу.',
          variant: 'destructive' as const,
        };
      }
      
      if (status === 500) {
        return {
          icon: Server,
          title: 'Ошибка сервера',
          message: 'Произошла внутренняя ошибка сервера. Попробуйте позже или обратитесь к администратору.',
          variant: 'destructive' as const,
        };
      }
      
      if (error.code === 'ERR_NETWORK' || status === 0 || !status) {
        return {
          icon: WifiOff,
          title: 'Нет связи с сервером',
          message: 'Не удалось подключиться к серверу. Проверьте подключение к интернету.',
          variant: 'destructive' as const,
        };
      }
    }
    
    // Generic error
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return {
      icon: AlertTriangle,
      title: title || 'Произошла ошибка',
      message: errorMessage,
      variant: 'destructive' as const,
    };
  };

  const details = getErrorDetails();
  const Icon = details.icon;

  return (
    <Alert variant={details.variant} className="my-4">
      <Icon className="h-4 w-4" />
      <AlertTitle>{details.title}</AlertTitle>
      <AlertDescription className="mt-2">
        {details.message}
      </AlertDescription>
      
      {(retry || showContactSupport) && (
        <div className="mt-4 flex gap-2">
          {retry && (
            <Button onClick={retry} variant="outline" size="sm">
              Повторить попытку
            </Button>
          )}
          {showContactSupport && (
            <Button variant="outline" size="sm" asChild>
              <a href="mailto:support@example.com">
                Связаться с поддержкой
              </a>
            </Button>
          )}
        </div>
      )}
    </Alert>
  );
}
