import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useUsers } from '@/hooks/useUsers';

interface ReportFiltersProps {
  selectedUsername: string;
  selectedDate: Date;
  onUsernameChange: (username: string) => void;
  onDateChange: (date: Date) => void;
}

export default function ReportFilters({
  selectedUsername,
  selectedDate,
  onUsernameChange,
  onDateChange,
}: ReportFiltersProps) {
  const { data: users } = useUsers();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Select value={selectedUsername} onValueChange={onUsernameChange}>
        <SelectTrigger className="w-full sm:w-[280px]">
          <SelectValue placeholder="Выберите пользователя" />
        </SelectTrigger>
        <SelectContent>
          {users?.map((username) => (
            <SelectItem key={username} value={username}>
              {username}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full sm:w-[280px] justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, 'PPP', { locale: ru }) : 'Выберите дату'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateChange(date)}
            initialFocus
            className="p-3 pointer-events-auto"
            locale={ru}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
