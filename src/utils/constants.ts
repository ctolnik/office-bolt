// Color constants
export const COLORS = {
  // Status colors
  online: '#10b981',
  offline: '#ef4444',
  idle: '#f59e0b',
  
  // Severity colors
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#f59e0b',
  low: '#3b82f6',
  
  // Category colors
  productive: '#10b981',
  unproductive: '#ef4444',
  neutral: '#6b7280',
  communication: '#3b82f6',
  system: '#9ca3af',
  
  // UI colors
  primary: '#3b82f6',
  secondary: '#6b7280',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

// Default application categories
export const DEFAULT_APP_CATEGORIES = {
  productive: [
    'Code.exe', 'idea64.exe', 'WINWORD.EXE', 'EXCEL.EXE', 
    'POWERPNT.EXE', 'Photoshop.exe', 'illustrator.exe'
  ],
  communication: [
    'Telegram.exe', 'Slack.exe', 'Teams.exe', 'Zoom.exe', 
    'Discord.exe', 'Skype.exe'
  ],
  neutral: [
    'chrome.exe', 'firefox.exe', 'msedge.exe', 'safari.exe',
    'Outlook.exe', 'Thunderbird.exe'
  ],
  unproductive: [
    'Steam.exe', 'EpicGamesLauncher.exe', 'Spotify.exe'
  ],
  system: [
    'explorer.exe', 'SystemSettings.exe', 'taskmgr.exe'
  ]
};

// Refresh intervals
export const REFRESH_INTERVALS = {
  agents: Number(import.meta.env.VITE_AGENTS_REFRESH_INTERVAL) || 30000,
  dashboard: Number(import.meta.env.VITE_DASHBOARD_REFRESH_INTERVAL) || 60000,
};

// Feature flags
export const FEATURES = {
  screenshots: import.meta.env.VITE_ENABLE_SCREENSHOTS === 'true',
  keylogger: import.meta.env.VITE_ENABLE_KEYLOGGER === 'true',
  dlp: import.meta.env.VITE_ENABLE_DLP === 'true',
};

// API configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || '',
  apiKey: import.meta.env.VITE_API_KEY || '',
  timeout: 30000,
};
