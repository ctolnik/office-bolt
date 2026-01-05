import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatDuration } from '@/utils/formatters';
import { getCategoryChartColor } from '@/utils/categoryUtils';
import type { ProgramUsage } from '@/types';

interface ApplicationsChartProps {
  programs: ProgramUsage[];
  maxItems?: number;
}

export function ApplicationsChart({ programs, maxItems = 8 }: ApplicationsChartProps) {
  // Take top programs and group the rest as "Other"
  const sortedPrograms = [...programs].sort((a, b) => b.duration_sec - a.duration_sec);
  const topPrograms = sortedPrograms.slice(0, maxItems);
  const otherPrograms = sortedPrograms.slice(maxItems);
  
  const chartData = topPrograms.map(program => ({
    name: program.friendly_name.replace('.exe', ''),
    value: program.duration_sec,
    fill: getCategoryChartColor(program.category),
  }));

  // Add "Other" category if there are more programs
  if (otherPrograms.length > 0) {
    const otherDuration = otherPrograms.reduce((sum, p) => sum + p.duration_sec, 0);
    chartData.push({
      name: 'Прочие',
      value: otherDuration,
      fill: getCategoryChartColor('neutral'),
    });
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Топ приложений</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Нет данных о приложениях
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalDuration = chartData.reduce((sum, item) => sum + item.value, 0);

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalDuration) * 100).toFixed(1);
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
        <CardTitle>Топ приложений</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
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
