// IMPROVEMENT: [FRONTEND_IMPROVEMENTS_SPEC] - Table of Contents for quick navigation
// Date: 2025-10-30
// Related to: Section 12.4 - Navigation within report

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Clock, 
  Monitor, 
  Camera, 
  Keyboard, 
  Usb, 
  File, 
  AlertTriangle 
} from 'lucide-react';

interface TOCSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
  variant?: 'default' | 'destructive';
}

interface ReportTableOfContentsProps {
  sections: TOCSection[];
}

export function ReportTableOfContents({ sections }: ReportTableOfContentsProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Содержание отчёта</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant="ghost"
              className={`justify-start ${
                section.variant === 'destructive' ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : ''
              }`}
              onClick={() => scrollToSection(section.id)}
            >
              {section.icon}
              <span className="ml-2 flex-1 text-left truncate">
                {section.label}
              </span>
              {section.count !== undefined && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({section.count})
                </span>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to generate TOC data from report
export function generateReportTOC(report: {
  applications?: any[];
  screenshots?: any[];
  keyboard_periods?: any[];
  usb_events?: any[];
  file_events?: any[];
  dlp_alerts?: any[];
}): TOCSection[] {
  const sections: TOCSection[] = [
    {
      id: 'summary',
      label: 'Сводка',
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: 'timeline',
      label: 'Временная шкала',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: 'applications',
      label: 'Приложения',
      icon: <Monitor className="h-4 w-4" />,
      count: report.applications?.length || 0,
    },
    {
      id: 'screenshots',
      label: 'Скриншоты',
      icon: <Camera className="h-4 w-4" />,
      count: report.screenshots?.length || 0,
    },
    {
      id: 'keyboard',
      label: 'Клавиатура',
      icon: <Keyboard className="h-4 w-4" />,
    },
    {
      id: 'usb',
      label: 'USB события',
      icon: <Usb className="h-4 w-4" />,
      count: report.usb_events?.length || 0,
    },
    {
      id: 'files',
      label: 'Файлы',
      icon: <File className="h-4 w-4" />,
      count: report.file_events?.length || 0,
    },
  ];

  // Add DLP alerts if present
  if (report.dlp_alerts && report.dlp_alerts.length > 0) {
    sections.splice(1, 0, {
      id: 'dlp',
      label: 'DLP Алерты',
      icon: <AlertTriangle className="h-4 w-4" />,
      count: report.dlp_alerts.length,
      variant: 'destructive',
    });
  }

  return sections;
}
