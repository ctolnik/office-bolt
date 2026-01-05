import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyboardPeriod } from '@/types';
import { formatDate } from '@/utils/formatters';
import { formatKeyboardInput, parseKeyboardEvents } from '@/utils/keyboardFormatter';
import { Separator } from '@/components/ui/separator';

interface KeyboardViewerProps {
  periods: KeyboardPeriod[];
}

export default function KeyboardViewer({ periods }: KeyboardViewerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Клавиатурные события</CardTitle>
        <p className="text-sm text-muted-foreground">
          Форматирование: <del>удалено Backspace</del>, <mark>выделено Ctrl+A</mark>,{' '}
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
            Ctrl+C/V
          </span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {periods.map((period, index) => {
            // raw_keys may be a JSON string, parse it if needed
            const rawKeys = typeof period.raw_keys === 'string' 
              ? parseKeyboardEvents(period.raw_keys)
              : (period.raw_keys || []);
            
            // Use formatted_text if raw_keys is empty or use formatted HTML
            const hasRawKeys = Array.isArray(rawKeys) && rawKeys.length > 0;
            const formattedHtml = hasRawKeys ? formatKeyboardInput(rawKeys) : '';
            const displayText = formattedHtml || period.formatted_text || 'Нет данных';
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{period.application}</p>
                    <p className="text-sm text-muted-foreground">{period.window_title}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(period.start, 'HH:mm:ss')} - {formatDate(period.end, 'HH:mm:ss')}
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre-wrap break-words">
                  {formattedHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />
                  ) : (
                    <span className="text-muted-foreground">{displayText}</span>
                  )}
                </div>
                
                {index < periods.length - 1 && <Separator className="my-4" />}
              </div>
            );
          })}
          
          {periods.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Нет клавиатурных событий для отображения
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
