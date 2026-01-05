/**
 * Utility functions for working with application categories
 */

export type AppCategory = 'productive' | 'unproductive' | 'neutral' | 'communication' | 'entertainment' | 'system';
export type ProcessCategory = 'productive' | 'unproductive' | 'neutral' | 'communication' | 'entertainment';

/**
 * Category labels for UI display
 */
export const CATEGORY_LABELS: Record<AppCategory, string> = {
  productive: 'Продуктивные',
  unproductive: 'Непродуктивные',
  neutral: 'Нейтральные',
  communication: 'Коммуникация',
  entertainment: 'Развлечения',
  system: 'Системные',
} as const;

/**
 * Category labels for UI display (excluding 'system' for process catalog)
 */
export const PROCESS_CATEGORY_LABELS: Record<ProcessCategory, string> = {
  productive: 'Продуктивные',
  unproductive: 'Непродуктивные',
  neutral: 'Нейтральные',
  communication: 'Коммуникация',
  entertainment: 'Развлечения',
} as const;

/**
 * Category descriptions
 */
export const CATEGORY_DESCRIPTIONS = {
  productive: 'Работа: IDE, Office, Email',
  unproductive: 'Отвлечения: YouTube, соц. сети, игры',
  neutral: 'Нейтральные: Браузеры и прочее',
  communication: 'Общение: Teams, Slack, Telegram',
  entertainment: 'Развлечения: Игры, медиа',
  system: 'Системные приложения',
} as const;

/**
 * Get Tailwind CSS color class for a category
 */
export function getCategoryColor(category?: AppCategory): string {
  switch (category) {
    case 'productive':
      return 'text-category-productive';
    case 'unproductive':
      return 'text-category-unproductive';
    case 'neutral':
      return 'text-category-neutral';
    case 'communication':
      return 'text-category-communication';
    case 'entertainment':
      return 'text-category-entertainment';
    case 'system':
      return 'text-category-system';
    default:
      return 'text-category-neutral';
  }
}

/**
 * Get hex color for charts (Recharts fill property)
 */
export function getCategoryChartColor(category?: AppCategory): string {
  switch (category) {
    case 'productive':
      return 'hsl(142, 71%, 45%)';       // Green
    case 'unproductive':
      return 'hsl(0, 84%, 60%)';         // Red
    case 'neutral':
      return 'hsl(215, 16%, 47%)';       // Gray
    case 'communication':
      return 'hsl(217, 91%, 60%)';       // Blue
    case 'entertainment':
      return 'hsl(25, 95%, 53%)';        // Orange
    case 'system':
      return 'hsl(220, 9%, 46%)';        // Dark gray
    default:
      return 'hsl(215, 16%, 47%)';       // Gray as default
  }
}

/**
 * Get background color class for badges
 */
export function getCategoryBgClass(category?: AppCategory): string {
  switch (category) {
    case 'productive':
      return 'bg-category-productive/10 text-category-productive';
    case 'unproductive':
      return 'bg-category-unproductive/10 text-category-unproductive';
    case 'neutral':
      return 'bg-category-neutral/10 text-category-neutral';
    case 'communication':
      return 'bg-category-communication/10 text-category-communication';
    case 'entertainment':
      return 'bg-category-entertainment/10 text-category-entertainment';
    case 'system':
      return 'bg-category-system/10 text-category-system';
    default:
      return 'bg-category-neutral/10 text-category-neutral';
  }
}

/**
 * Get activity state color for timeline
 */
export function getActivityStateColor(state: 'active' | 'idle' | 'offline'): string {
  switch (state) {
    case 'active':
      return 'hsl(142, 71%, 45%)';       // Green
    case 'idle':
      return 'hsl(43, 96%, 56%)';        // Yellow
    case 'offline':
      return 'hsl(215, 16%, 47%)';       // Gray
    default:
      return 'hsl(215, 16%, 47%)';
  }
}
