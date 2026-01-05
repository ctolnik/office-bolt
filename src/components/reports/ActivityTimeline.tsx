import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityEvent } from '@/types';
import { getCategoryBgClass, type AppCategory } from '@/utils/categoryUtils';
import { format, parseISO, startOfDay, differenceInMinutes } from 'date-fns';

interface ActivityTimelineProps {
  activities: ActivityEvent[];
  date: string;
}

export default function ActivityTimeline({ activities, date }: ActivityTimelineProps) {
  const dayStart = startOfDay(parseISO(date));
  const totalMinutes = 24 * 60;

  const getPositionAndWidth = (event: ActivityEvent) => {
    const eventTime = parseISO(event.timestamp);
    const minutesFromStart = differenceInMinutes(eventTime, dayStart);
    const position = (minutesFromStart / totalMinutes) * 100;
    const width = (event.duration / totalMinutes) * 100;
    return { position, width };
  };

  const groupedActivities = activities.reduce((acc, event) => {
    const category = event.category || 'neutral';
    if (!acc[category]) acc[category] = [];
    acc[category].push(event);
    return acc;
  }, {} as Record<string, ActivityEvent[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Временная шкала активности</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Hour markers */}
          <div className="relative h-8 border-b border-border">
            {Array.from({ length: 25 }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 h-full border-l border-border"
                style={{ left: `${(i / 24) * 100}%` }}
              >
                <span className="absolute -top-6 -left-2 text-xs text-muted-foreground">
                  {i.toString().padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          {/* Activity bars */}
          <div className="relative h-12 bg-muted rounded">
            {activities.map((event, idx) => {
              const { position, width } = getPositionAndWidth(event);
              const colorClass = getCategoryBgClass((event.category || 'neutral') as AppCategory);
              
              return (
                <div
                  key={idx}
                  className={`absolute h-full ${colorClass} opacity-70 hover:opacity-100 transition-opacity cursor-pointer`}
                  style={{
                    left: `${position}%`,
                    width: `${Math.max(width, 0.5)}%`,
                  }}
                  title={`${event.process_name} - ${event.window_title}`}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            {Object.keys(groupedActivities).map((category) => (
              <div key={category} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${getCategoryBgClass(category as AppCategory)}`} />
                <span className="capitalize">{category}</span>
                <span className="text-muted-foreground">
                  ({groupedActivities[category].length})
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
