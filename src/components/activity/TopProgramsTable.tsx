import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, FileX } from 'lucide-react';
import { formatDuration } from '@/utils/formatters';
import { getCategoryBgClass, CATEGORY_LABELS } from '@/utils/categoryUtils';
import type { ProgramUsage } from '@/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TopProgramsTableProps {
  programs: ProgramUsage[];
  activeSeconds: number;
}

export function TopProgramsTable({ programs, activeSeconds }: TopProgramsTableProps) {
  // Handle empty state
  if (!programs || programs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Топ программ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileX className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              Нет данных о программах
            </p>
            <p className="text-sm text-muted-foreground">
              Использование программ не зафиксировано за выбранный период
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Топ программ</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Программа</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Время работы</TableHead>
              <TableHead>% от активности</TableHead>
              <TableHead className="w-24">Детали</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((program, index) => {
              const percentage = activeSeconds > 0 
                ? ((program.duration_sec / activeSeconds) * 100).toFixed(1) 
                : '0.0';
              return (
                <ProgramRow
                  key={index}
                  program={program}
                  index={index + 1}
                  percentage={percentage}
                />
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface ProgramRowProps {
  program: ProgramUsage;
  index: number;
  percentage: string;
}

function ProgramRow({ program, index, percentage }: ProgramRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasDetails = program.window_titles && program.window_titles.length > 0;

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{index}</TableCell>
        <TableCell>
          <div className="font-medium">{program.friendly_name}</div>
          <div className="text-xs text-muted-foreground">{program.process_name}</div>
        </TableCell>
        <TableCell>
          {program.category && (
            <Badge variant="outline" className={getCategoryBgClass(program.category)}>
              {CATEGORY_LABELS[program.category]}
            </Badge>
          )}
        </TableCell>
        <TableCell>{formatDuration(program.duration_sec)}</TableCell>
        <TableCell>
          <Badge variant="outline">{percentage}%</Badge>
        </TableCell>
        <TableCell>
          {hasDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
        </TableCell>
      </TableRow>
      {hasDetails && isOpen && (
        <TableRow>
          <TableCell colSpan={6} className="bg-muted/50">
            <div className="py-2 px-4">
              <p className="text-sm font-medium mb-2">Посещенные страницы/документы:</p>
              <ul className="space-y-1">
                {program.window_titles?.map((title, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start">
                    <span className="mr-2">•</span>
                    <span>{title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
