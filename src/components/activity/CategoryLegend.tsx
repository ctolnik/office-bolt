import { Card, CardContent } from '@/components/ui/card';
import { getCategoryChartColor, CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from '@/utils/categoryUtils';

export function CategoryLegend() {
  const categories: Array<'productive' | 'unproductive' | 'neutral' | 'communication' | 'entertainment'> = [
    'productive',
    'unproductive', 
    'neutral',
    'communication',
    'entertainment',
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-sm font-semibold mb-4">Категории приложений</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((category) => (
            <div key={category} className="flex items-start gap-2">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"
                style={{ backgroundColor: getCategoryChartColor(category) }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  {CATEGORY_LABELS[category]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {CATEGORY_DESCRIPTIONS[category]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
