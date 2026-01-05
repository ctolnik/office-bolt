import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ApplicationUsage } from '@/types';
import { formatDuration, formatDurationShort } from '@/utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { COLORS } from '@/utils/constants';

interface ApplicationsReportProps {
  applications: ApplicationUsage[];
}

// Group applications by normalized name (remove .exe, group similar processes)
function groupApplications(applications: ApplicationUsage[]): ApplicationUsage[] {
  const grouped = new Map<string, ApplicationUsage>();

  applications.forEach((app) => {
    // Normalize name: remove .exe/.EXE and convert to lowercase
    const normalizedName = app.process_name
      .toLowerCase()
      .replace(/\.exe$/i, '')
      .trim();

    if (grouped.has(normalizedName)) {
      const existing = grouped.get(normalizedName)!;
      // Sum duration and count
      existing.duration += app.duration;
      existing.count += app.count;
    } else {
      // Create new entry with normalized display name
      grouped.set(normalizedName, {
        ...app,
        process_name: normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1),
      });
    }
  });

  // Recalculate percentages
  const totalDuration = Array.from(grouped.values()).reduce(
    (sum, app) => sum + app.duration,
    0
  );

  return Array.from(grouped.values()).map((app) => ({
    ...app,
    percentage: totalDuration > 0 ? (app.duration / totalDuration) * 100 : 0,
  }));
}

export default function ApplicationsReport({ applications }: ApplicationsReportProps) {
  // Group applications by normalized name
  const groupedApplications = groupApplications(applications);

  const topApps = [...groupedApplications]
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10);

  const pieData = topApps.map(app => ({
    name: app.process_name,
    value: app.duration,
    category: app.category,
  }));

  const barData = topApps.map(app => ({
    name: app.process_name, // Already normalized
    duration: app.duration / 3600,
    category: app.category,
  }));

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      productive: COLORS.productive,
      unproductive: COLORS.unproductive,
      neutral: COLORS.neutral,
      communication: COLORS.communication,
      system: COLORS.system,
    };
    return colorMap[category] || COLORS.neutral;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Статистика использования приложений</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div>
              <h3 className="text-sm font-medium mb-4 text-center">Распределение времени</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${formatDurationShort(entry.value)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatDurationShort(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div>
              <h3 className="text-sm font-medium mb-4 text-center">Топ приложений (часы)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} ч`} />
                  <Bar dataKey="duration" fill={COLORS.primary}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Детальная таблица приложений</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Приложение</TableHead>
                <TableHead>Заголовок окна</TableHead>
                <TableHead>Длительность</TableHead>
                <TableHead>Запуски</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Процент</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedApplications.map((app, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{app.process_name}</TableCell>
                  <TableCell className="max-w-xs truncate">{app.window_title}</TableCell>
                  <TableCell>{formatDurationShort(app.duration)}</TableCell>
                  <TableCell>{app.count}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {app.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{app.percentage.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
