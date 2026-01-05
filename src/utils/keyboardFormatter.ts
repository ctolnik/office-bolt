import DOMPurify from 'dompurify';
import type { KeyEvent } from '@/types';

/**
 * Format keyboard events with special HTML markup:
 * - Backspace: <del>deleted text</del>
 * - Ctrl+A: <mark>selected text</mark>
 * - Ctrl+C: [Ctrl+C] badge
 * - Ctrl+V: [Ctrl+V] badge
 */
export function formatKeyboardInput(events: KeyEvent[] | undefined | null): string {
  if (!events || events.length === 0) {
    return '';
  }

  let output = '';
  let buffer: string[] = [];

  for (const event of events) {
    if (event.key === 'Backspace') {
      if (buffer.length > 0) {
        const deleted = buffer.pop();
        output += `<del>${deleted}</del>`;
      }
    } else if (event.modifiers?.includes('ctrl') && event.key.toLowerCase() === 'a') {
      const text = buffer.join('');
      if (text) {
        output += `<mark>${text}</mark>`;
        buffer = [];
      }
    } else if (event.modifiers?.includes('ctrl') && event.key.toLowerCase() === 'c') {
      // Flush buffer before adding badge
      if (buffer.length > 0) {
        output += buffer.join('');
        buffer = [];
      }
      output += '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mx-1">[Ctrl+C]</span>';
    } else if (event.modifiers?.includes('ctrl') && event.key.toLowerCase() === 'v') {
      // Flush buffer before adding badge
      if (buffer.length > 0) {
        output += buffer.join('');
        buffer = [];
      }
      output += '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mx-1">[Ctrl+V]</span>';
    } else if (event.key === 'Enter') {
      // Flush buffer and add line break
      if (buffer.length > 0) {
        output += buffer.join('');
        buffer = [];
      }
      output += '<br/>';
    } else if (event.key.length === 1) {
      // Normal character
      buffer.push(event.key);
      // Flush buffer periodically to avoid memory issues
      if (buffer.length > 50) {
        output += buffer.join('');
        buffer = [];
      }
    }
  }

  // Flush remaining buffer
  if (buffer.length > 0) {
    output += buffer.join('');
  }

  // Sanitize HTML to prevent XSS
  return DOMPurify.sanitize(output, {
    ALLOWED_TAGS: ['del', 'mark', 'span', 'br'],
    ALLOWED_ATTR: ['class']
  });
}

/**
 * Parse keyboard events JSON string to KeyEvent array
 */
export function parseKeyboardEvents(keysJson: string): KeyEvent[] {
  try {
    return JSON.parse(keysJson) as KeyEvent[];
  } catch (error) {
    console.error('Failed to parse keyboard events:', error);
    return [];
  }
}
