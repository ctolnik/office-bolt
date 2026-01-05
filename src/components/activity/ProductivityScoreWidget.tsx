import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { DailyActivitySummary } from '@/types';

interface ProductivityScoreWidgetProps {
  summary: DailyActivitySummary;
}

export function ProductivityScoreWidget({ summary }: ProductivityScoreWidgetProps) {
  const productivityScore = summary.productivity_score || 0;
  
  // Determine color and variant based on score
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-category-productive';
    if (score >= 50) return 'text-category-communication';
    if (score >= 30) return 'text-category-entertainment';
    return 'text-category-unproductive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Отлично';
    if (score >= 50) return 'Хорошо';
    if (score >= 30) return 'Средне';
    return 'Низкая';
  };

  const getProgressColor = (score: number) => {
    if (score >= 70) return '[&>div]:bg-category-productive';
    if (score >= 50) return '[&>div]:bg-category-communication';
    if (score >= 30) return '[&>div]:bg-category-entertainment';
    return '[&>div]:bg-category-unproductive';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Показатель продуктивности</CardTitle>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p className="font-semibold mb-2">Как рассчитывается продуктивность?</p>
                  <p className="text-sm mb-2">
                    Формула: (Продуктивное время / Активное время) × 100%
                  </p>
                  <p className="text-sm mb-2">
                    <span className="font-medium">Продуктивные приложения:</span> IDE (Visual Studio Code, PyCharm), 
                    офисные программы (Word, Excel), почта (Outlook)
                  </p>
                  <p className="text-sm mb-2">
                    <span className="font-medium">Непродуктивные:</span> YouTube, соц. сети, игры
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Нейтральные:</span> Браузеры (зависит от контекста использования)
                  </p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <Badge variant="outline" className={getScoreColor(productivityScore)}>
            {getScoreLabel(productivityScore)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${getScoreColor(productivityScore)}`}>
                {productivityScore.toFixed(0)}%
              </span>
              {productivityScore >= 50 ? (
                <TrendingUp className="h-5 w-5 text-category-productive" />
              ) : (
                <TrendingDown className="h-5 w-5 text-category-unproductive" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Продуктивность за день
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={productivityScore} 
            className={`h-3 ${getProgressColor(productivityScore)}`}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-category-productive">
                {((summary.productive_time || 0) / 3600).toFixed(1)}ч
              </p>
              <p className="text-xs text-muted-foreground">Продуктивно</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-category-neutral">
                {((summary.neutral_time || 0) / 3600).toFixed(1)}ч
              </p>
              <p className="text-xs text-muted-foreground">Нейтрально</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-category-unproductive">
                {((summary.unproductive_time || 0) / 3600).toFixed(1)}ч
              </p>
              <p className="text-xs text-muted-foreground">Непродуктивно</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
