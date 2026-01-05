import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatDuration } from '@/utils/formatters';
import { getCategoryChartColor } from '@/utils/categoryUtils';
import type { DailyActivitySummary } from '@/types';
import { Info } from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ProductivityChartProps {
  summary: DailyActivitySummary;
}

export function ProductivityDistributionChart({ summary }: ProductivityChartProps) {
  const productivityData = [
    {
      name: 'Продуктивное',
      value: summary.productive_time || 0,
      fill: getCategoryChartColor('productive'),
    },
    {
      name: 'Непродуктивное',
      value: summary.unproductive_time || 0,
      fill: getCategoryChartColor('unproductive'),
    },
    {
      name: 'Нейтральное',
      value: summary.neutral_time || 0,
      fill: getCategoryChartColor('neutral'),
    },
  ].filter(item => item.value > 0); // Only show categories with time

  const totalTime = (summary.productive_time || 0) + 
                   (summary.unproductive_time || 0) + 
                   (summary.neutral_time || 0);

  if (totalTime === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Распределение продуктивности</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Недостаточно данных для отображения
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalTime) * 100).toFixed(1);
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatDuration(data.value)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Распределение продуктивности</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="font-semibold mb-2">Категории активности</p>
                <ul className="space-y-1 text-sm">
                  <li><span className="font-medium text-category-productive">Продуктивное:</span> Работа в IDE, Office, Email</li>
                  <li><span className="font-medium text-category-unproductive">Непродуктивное:</span> YouTube, соц. сети, игры</li>
                  <li><span className="font-medium text-category-neutral">Нейтральное:</span> Браузеры, другие приложения</li>
                </ul>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={productivityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {productivityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={renderCustomTooltip} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
