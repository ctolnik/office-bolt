import type { DailyActivitySummary, ActivitySegment } from '@/types';

export const mockActivitySummary: DailyActivitySummary = {
  date: new Date().toISOString().split('T')[0],
  computer_name: 'DEMO-PC',
  username: 'demo.user',
  active_seconds: 25200, // 7 hours
  idle_seconds: 3600,    // 1 hour
  offline_seconds: 0,
  productive_time: 14400,   // 4 hours
  unproductive_time: 3600,  // 1 hour
  neutral_time: 7200,       // 2 hours
  productivity_score: 57.1, // 4h / 7h = 57.1%
  top_programs: [
    {
      process_name: 'code.exe',
      friendly_name: 'Visual Studio Code',
      duration_sec: 12600, // 3.5 hours
      category: 'productive',
      window_titles: [
        'main.ts - Visual Studio Code',
        'App.tsx - Visual Studio Code',
        'README.md - Visual Studio Code',
      ],
    },
    {
      process_name: 'chrome.exe',
      friendly_name: 'Google Chrome',
      duration_sec: 7200, // 2 hours
      category: 'neutral',
      window_titles: [
        'GitHub - Google Chrome',
        'Stack Overflow - Google Chrome',
        'Documentation - Google Chrome',
      ],
    },
    {
      process_name: 'outlook.exe',
      friendly_name: 'Microsoft Outlook',
      duration_sec: 3600, // 1 hour
      category: 'productive',
      window_titles: [
        'Inbox - Outlook',
        'Calendar - Outlook',
      ],
    },
    {
      process_name: 'slack.exe',
      friendly_name: 'Slack',
      duration_sec: 1800, // 30 minutes
      category: 'communication',
      window_titles: ['#general - Slack', '#dev-team - Slack'],
    },
  ],
};

// Generate mock segments for timeline (30-minute intervals)
export function generateMockSegments(date: string = new Date().toISOString().split('T')[0]): ActivitySegment[] {
  const segments: ActivitySegment[] = [];
  
  // Work day from 9:00 to 18:00
  const programs = [
    { name: 'code.exe', title: 'Visual Studio Code', category: 'productive' as const },
    { name: 'chrome.exe', title: 'GitHub - Google Chrome', category: 'neutral' as const },
    { name: 'outlook.exe', title: 'Inbox - Outlook', category: 'productive' as const },
    { name: 'slack.exe', title: '#dev-team - Slack', category: 'communication' as const },
  ];

  let hour = 9;
  let minute = 0;
  
  while (hour < 18) {
    const timestamp_start = `${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`;
    
    // Calculate end time (30 minutes later)
    let endHour = hour;
    let endMinute = minute + 30;
    if (endMinute >= 60) {
      endHour += 1;
      endMinute -= 60;
    }
    
    const timestamp_end = `${date}T${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00Z`;
    
    // Determine state based on time
    let state: 'active' | 'idle' | 'offline';
    if (hour === 13 && minute === 0) {
      state = 'idle'; // Lunch break
    } else if (hour === 15 && minute === 30) {
      state = 'idle'; // Coffee break
    } else if (hour >= 9 && hour < 18) {
      state = Math.random() > 0.7 ? 'idle' : 'active';
    } else {
      state = 'offline';
    }
    
    const program = programs[Math.floor(Math.random() * programs.length)];
    
    segments.push({
      timestamp_start,
      timestamp_end,
      duration_sec: 1800, // 30 minutes
      state,
      process_name: program.name,
      window_title: program.title,
      category: program.category,
      computer_name: 'DEMO-PC',
      username: 'demo.user',
    });
    
    // Move to next 30-minute interval
    minute += 30;
    if (minute >= 60) {
      hour += 1;
      minute = 0;
    }
  }
  
  return segments;
}
