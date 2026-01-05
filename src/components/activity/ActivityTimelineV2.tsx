import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { getActivityStateColor } from '@/utils/categoryUtils';
import type { ActivitySegment } from '@/types';
import { parseISO } from 'date-fns';

interface ActivityTimelineV2Props {
  segments: ActivitySegment[];
  loading?: boolean;
}

interface TimelineInterval {
  time: string;
  hour: number;
  minute: number;
  state: 'active' | 'idle' | 'offline';
  program: string;
  windowTitle: string;
}

// Build timeline with 30-minute intervals
function buildTimeline(segments: ActivitySegment[]): TimelineInterval[] {
  const intervals: TimelineInterval[] = [];
  
  // Create 48 intervals (24 hours * 2 per hour)
  for (let i = 0; i < 48; i++) {
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    
    intervals.push({
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      hour,
      minute,
      state: 'offline',
      program: '',
      windowTitle: '',
    });
  }
  
  // Fill intervals with actual segment data
  segments.forEach(segment => {
    try {
      const startTime = parseISO(segment.timestamp_start);
      const hour = startTime.getHours();
      const minute = startTime.getMinutes();
      
      // Find matching 30-minute interval
      const intervalIndex = hour * 2 + Math.floor(minute / 30);
      
      if (intervalIndex >= 0 && intervalIndex < 48) {
        intervals[intervalIndex] = {
          time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          hour,
          minute,
          state: segment.state,
          program: segment.process_name,
          windowTitle: segment.window_title,
        };
      }
    } catch (error) {
      console.error('Error parsing segment timestamp:', error);
    }
  });
  
  return intervals;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} мин`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}ч ${remainingMinutes}мин`;
}

export function ActivityTimelineV2({ segments, loading }: ActivityTimelineV2Props) {
  const intervals = buildTimeline(segments);
  
  // Filter to only show work hours (9:00 - 18:00)
  const workHourIntervals = intervals.filter(interval => 
    interval.hour >= 9 && interval.hour < 18
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Временная шкала активности</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Временная шкала активности</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline visualization */}
          <div className="relative">
            {/* Hour markers */}
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(hour => (
                <div key={hour} className="flex-1 text-center">
                  {hour}:00
                </div>
              ))}
            </div>
            
            {/* Timeline bars with enhanced contrast */}
            <TooltipProvider>
              <div className="flex gap-0.5 h-12">
                {workHourIntervals.map((interval, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className="flex-1 rounded-sm cursor-pointer transition-all hover:opacity-80 hover:scale-105 shadow-sm"
                        style={{
                          backgroundColor: getActivityStateColor(interval.state),
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm space-y-1">
                        <div className="font-semibold">
                          {interval.time} - {interval.hour}:{(interval.minute + 30).toString().padStart(2, '0')}
                        </div>
                        <div>
                          <span className="font-medium">Состояние:</span>{' '}
                          {interval.state === 'active' && 'Активность'}
                          {interval.state === 'idle' && 'Простой'}
                          {interval.state === 'offline' && 'Отсутствие'}
                        </div>
                        {interval.program && (
                          <>
                            <div>
                              <span className="font-medium">Программа:</span> {interval.program}
                            </div>
                            {interval.windowTitle && (
                              <div className="max-w-xs truncate">
                                <span className="font-medium">Детали:</span> {interval.windowTitle}
                              </div>
                            )}
                          </>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          Длительность: 30 мин
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>

          {/* Legend with enhanced contrast */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded shadow-sm" 
                style={{ backgroundColor: getActivityStateColor('active') }} 
              />
              <span className="font-medium">Активность</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded shadow-sm" 
                style={{ backgroundColor: getActivityStateColor('idle') }} 
              />
              <span className="font-medium">Простой</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded shadow-sm" 
                style={{ backgroundColor: getActivityStateColor('offline') }} 
              />
              <span className="font-medium">Offline</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            * График показывает активность с разбивкой по 30-минутным интервалам в течение рабочего дня (09:00-18:00). Наведите на интервал для просмотра деталей.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
