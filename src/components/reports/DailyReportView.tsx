import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DailyReport } from '@/types';
import { formatDate, formatDuration, formatPercentage } from '@/utils/formatters';
import { User, Calendar, TrendingUp } from 'lucide-react';
import ActivityTimeline from './ActivityTimeline';
import ScreenshotsGallery from './ScreenshotsGallery';
import KeyboardViewer from './KeyboardViewer';
import USBEventsTable from './USBEventsTable';
import FileEventsTable from './FileEventsTable';
import ApplicationsReport from './ApplicationsReport';
import DLPAlertsSection from './DLPAlertsSection';
import ExportButtons from './ExportButtons';
import { ReportTableOfContents, generateReportTOC } from './ReportTableOfContents';

interface DailyReportViewProps {
  report: DailyReport;
}

export default function DailyReportView({ report }: DailyReportViewProps) {
  const { 
    username, 
    date, 
    summary, 
    activity_events = [],
    applications = [], 
    screenshots = [], 
    usb_events = [], 
    file_events = [], 
    keyboard_periods = [], 
    dlp_alerts = [] 
  } = report;

  return (
    <div id="daily-report-content" className="space-y-6">
      {/* Report Header */}
      <Card id="summary">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">Детальный отчет за день</CardTitle>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(date, 'dd MMMM yyyy')}</span>
                </div>
              </div>
            </div>
            <ExportButtons report={report} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Активное время</p>
              <p className="text-2xl font-bold">{formatDuration(summary.total_active_time)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Простой</p>
              <p className="text-2xl font-bold">{formatDuration(summary.total_idle_time)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Продуктивность</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{formatPercentage(summary.productivity_score)}</p>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Рабочий день</p>
              <p className="text-sm font-medium">
                {formatDate(summary.first_activity, 'HH:mm')} - {formatDate(summary.last_activity, 'HH:mm')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table of Contents */}
      <ReportTableOfContents sections={generateReportTOC(report)} />

      {/* DLP Alerts - Critical Section */}
      {dlp_alerts.length > 0 && (
        <>
          <div id="dlp">
            <DLPAlertsSection alerts={dlp_alerts} />
          </div>
          <Separator />
        </>
      )}

      {/* Activity Timeline */}
      {/* IMPROVEMENT: [FRONTEND_IMPROVEMENTS_SPEC] - Fixed empty timeline by passing activity_events */}
      {/* Date: 2025-10-30 - Related to: Section 12.3 */}
      <div id="timeline">
        <ActivityTimeline activities={activity_events} date={date} />
      </div>

      <Separator />

      {/* Applications Report */}
      <div id="applications">
        <ApplicationsReport applications={applications} />
      </div>

      <Separator />

      {/* Screenshots Gallery */}
      <div id="screenshots">
        <ScreenshotsGallery screenshots={screenshots} />
      </div>

      <Separator />

      {/* Keyboard Viewer */}
      <div id="keyboard">
        <KeyboardViewer periods={keyboard_periods} />
      </div>

      <Separator />

      {/* USB Events */}
      <div id="usb">
        <USBEventsTable events={usb_events} fileEvents={file_events} />
      </div>

      <Separator />

      {/* File Events */}
      <div id="files">
        <FileEventsTable events={file_events} />
      </div>
    </div>
  );
}
