// Agent types
export interface Agent {
  computer_name: string;
  username: string;
  last_seen: string;
  status: 'online' | 'offline' | 'idle';
  ip_address: string;
  os_version: string;
  agent_version: string;
  config: AgentConfig;
}

export interface AgentConfig {
  screenshot_interval: number;
  activity_tracking: boolean;
  keylogger_enabled: boolean;
  usb_monitoring: boolean;
  file_monitoring: boolean;
  dlp_enabled: boolean;
}

// Employee types
export interface Employee {
  id: string;
  username: string;
  computer_name?: string;  // Added for activity tracking
  full_name: string;
  department: string;
  position: string;
  email: string;
  consent_given: boolean;
  consent_date: string | null;
  created_at: string;
  is_active: boolean;
}

// Settings types
export interface ApplicationCategory {
  id: string;
  process_name: string;
  process_pattern?: string;
  category: 'productive' | 'unproductive' | 'neutral' | 'communication' | 'entertainment' | 'system';
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CategoryType {
  id: string;
  key: string;
  name: string;
  color?: string;
  sort_order?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryType {
  key: string;
  name: string;
  color?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateCategoryType {
  key?: string;
  name?: string;
  color?: string;
  sort_order?: number;
  is_active?: boolean;
}


// Activity Tracking Types
export interface DailyActivitySummary {
  date: string;
  computer_name: string;
  username: string;
  active_seconds: number;
  idle_seconds: number;
  offline_seconds: number;
  productive_time?: number;
  unproductive_time?: number;
  neutral_time?: number;
  productivity_score?: number;
  top_programs: ProgramUsage[];
}

export interface ProgramUsage {
  process_name: string;
  friendly_name: string;
  duration_sec: number;
  category?: 'productive' | 'unproductive' | 'neutral' | 'communication' | 'entertainment' | 'system';
  window_titles?: string[];
}

export interface ProcessCatalogEntry {
  id: string;
  friendly_name: string;
  process_names: string[];
  window_title_patterns: string[];
  category_id: string;
  category?: CategoryType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProcessCatalogEntry {
  friendly_name: string;
  process_names: string[];
  window_title_patterns: string[];
  category_id: string;
  is_active?: boolean;
}

export interface UpdateProcessCatalogEntry {
  friendly_name?: string;
  process_names?: string[];
  window_title_patterns?: string[];
  category_id?: string;
  is_active?: boolean;
}


export interface ActivitySegment {
  timestamp_start: string;
  timestamp_end: string;
  duration_sec: number;
  state: 'active' | 'idle' | 'offline';
  process_name: string;
  window_title: string;
  computer_name: string;
  username: string;
  category?: 'productive' | 'unproductive' | 'neutral' | 'communication' | 'entertainment' | 'system';
}

// Activity types
export interface ActivityEvent {
  timestamp: string;
  computer_name: string;
  username: string;
  window_title: string;
  process_name: string;
  duration: number;
  is_active: boolean;
  category?: 'productive' | 'unproductive' | 'neutral' | 'communication' | 'entertainment' | 'system';
}

export interface ActivitySummary {
  username: string;
  start_date: string;
  end_date: string;
  total_active_time: number;
  total_idle_time: number;
  productive_time: number;
  unproductive_time: number;
  neutral_time: number;
  first_activity: string;
  last_activity: string;
  productivity_score: number;
}

// Keyboard types
export interface KeyboardEvent {
  timestamp: string;
  computer_name: string;
  username: string;
  window_title: string;
  process_name: string;
  keys: string;
  formatted_text?: string;
}

export interface KeyEvent {
  key: string;
  timestamp: string;
  modifiers?: string[];
}

export interface KeyboardPeriod {
  start: string;
  end: string;
  application: string;
  window_title: string;
  formatted_text: string;
  raw_keys?: KeyEvent[] | string; // May be JSON string from backend
}

// USB types
export interface USBEvent {
  timestamp: string;
  computer_name: string;
  username: string;
  event_type: 'connected' | 'disconnected';
  device_name: string;
  device_id: string;
  volume_name?: string;
}

// File types
export interface FileEvent {
  timestamp: string;
  computer_name: string;
  username: string;
  event_type: 'copy' | 'move' | 'delete';
  source_path: string;
  destination_path?: string;
  file_size: number;
  file_hash?: string;
  is_dlp_alert: boolean;
}

// Screenshot types
export interface Screenshot {
  timestamp: string;
  computer_name: string;
  username: string;
  screenshot_id: string;
  minio_path: string;
  file_size: number;
  window_title: string;
  process_name: string;
}

// Alert types
export interface Alert {
  id: string;
  timestamp: string;
  computer_name: string;
  username: string;
  alert_type: 'dlp' | 'suspicious_activity' | 'policy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  details: Record<string, any>;
  is_resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
}

// Report types
export interface DailyReport {
  username: string;
  date: string;
  summary: ActivitySummary;
  activity_events: ActivityEvent[];
  applications: ApplicationUsage[];
  screenshots: Screenshot[];
  usb_events: USBEvent[];
  file_events: FileEvent[];
  keyboard_periods: KeyboardPeriod[];
  dlp_alerts: Alert[];
}

export interface ApplicationUsage {
  process_name: string;
  window_title: string;
  duration: number;
  count: number;
  category: string;
  percentage: number;
}

// Dashboard types
export interface DashboardStats {
  total_employees: number;
  active_now: number;
  offline: number;
  total_alerts: number;
  unresolved_alerts: number;
  avg_productivity: number;
  today_screenshots: number;
  today_usb_events: number;
  today_file_events: number;
}

// API response wrappers
export interface ApiResponse<T> {
  data: T;
  status: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
