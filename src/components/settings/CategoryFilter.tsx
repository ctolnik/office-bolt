import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORY_LABELS } from '@/utils/categoryUtils';

interface CategoryFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <Select
      value={value[0] || 'all'}
      onValueChange={(val) => onChange(val === 'all' ? [] : [val])}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Все категории" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Все категории</SelectItem>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
