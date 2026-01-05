import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDuration } from '@/utils/formatters';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { DailyActivitySummary } from '@/types';

interface ActivitySummaryCardsProps {
  summary: DailyActivitySummary;
}

export function ActivitySummaryCards({ summary }: ActivitySummaryCardsProps) {
  // Calculate percentages
  const totalSeconds = summary.active_seconds + summary.idle_seconds + summary.offline_seconds;
  const activePercentage = totalSeconds > 0 ? (summary.active_seconds / totalSeconds) * 100 : 0;
  const idlePercentage = totalSeconds > 0 ? (summary.idle_seconds / totalSeconds) * 100 : 0;
  const offlinePercentage = totalSeconds > 0 ? (summary.offline_seconds / totalSeconds) * 100 : 0;

  return (
    <TooltipProvider>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium">Активность</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-semibold mb-1">Активное время</p>
                  <p className="text-sm">
                    Время, когда пользователь работает за компьютером. Определяется по активности клавиатуры и мыши.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-category-productive">
              {formatDuration(summary.active_seconds)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {activePercentage.toFixed(1)}% от общего времени
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium">Простой</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-semibold mb-1">Время простоя</p>
                  <p className="text-sm">
                    Когда пользователь отошёл от компьютера. Если нет активности клавиатуры/мыши более 5 минут, 
                    но менее 30 минут — время считается как простой. Это время НЕ учитывается в расчёте продуктивности.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-category-entertainment">
              {formatDuration(summary.idle_seconds)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {idlePercentage.toFixed(1)}% от общего времени
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium">Offline</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-semibold mb-1">Offline время</p>
                  <p className="text-sm">
                    Компьютер не используется. Если нет активности более 30 минут — пользователь offline, 
                    или агент не отправляет данные на сервер.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-category-neutral">
              {formatDuration(summary.offline_seconds)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {offlinePercentage.toFixed(1)}% от общего времени
            </p>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
