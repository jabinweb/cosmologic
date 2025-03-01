import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';
  
  try {
    const d = new Date(date);
    // Check if date is valid
    if (isNaN(d.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(d);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
}

export function getCourseTags(course: { tags: string }): string[] {
  try {
    return JSON.parse(course.tags);
  } catch {
    return [];
  }
}
