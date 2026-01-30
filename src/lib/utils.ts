import { Deadline, CalendarEvent, DeadlineCategory } from '@/types';

export function deadlineToCalendarEvent(deadline: Deadline): CalendarEvent {
  const colors = getCategoryColors(deadline.category);

  return {
    id: deadline.id,
    title: truncateTitle(deadline.title, 50),
    start: deadline.date,
    allDay: true,
    backgroundColor: colors.background,
    borderColor: colors.border,
    textColor: colors.text,
    extendedProps: {
      deadline,
    },
  };
}

export function getCategoryColors(category: DeadlineCategory): {
  background: string;
  border: string;
  text: string;
} {
  const colorMap: Record<DeadlineCategory, { background: string; border: string; text: string }> = {
    hipaa: { background: '#3b82f6', border: '#2563eb', text: '#ffffff' },
    cms: { background: '#10b981', border: '#059669', text: '#ffffff' },
    interoperability: { background: '#8b5cf6', border: '#7c3aed', text: '#ffffff' },
    licensing: { background: '#f59e0b', border: '#d97706', text: '#000000' },
    oig: { background: '#ef4444', border: '#dc2626', text: '#ffffff' },
    state: { background: '#06b6d4', border: '#0891b2', text: '#ffffff' },
    other: { background: '#6b7280', border: '#4b5563', text: '#ffffff' },
  };

  return colorMap[category];
}

export function getCategoryLabel(category: DeadlineCategory): string {
  const labels: Record<DeadlineCategory, string> = {
    hipaa: 'HIPAA',
    cms: 'CMS/Medicare',
    interoperability: 'Interoperability',
    licensing: 'Licensing/CME',
    oig: 'OIG',
    state: 'State Regulations',
    other: 'Other',
  };

  return labels[category];
}

export function truncateTitle(title: string, maxLength: number): string {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength - 3) + '...';
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getDaysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function getDaysUntilLabel(dateStr: string): string {
  const days = getDaysUntil(dateStr);

  if (days < 0) {
    return `${Math.abs(days)} days ago`;
  }

  if (days === 0) {
    return 'Today';
  }

  if (days === 1) {
    return 'Tomorrow';
  }

  return `${days} days`;
}

export function filterDeadlines(
  deadlines: Deadline[],
  filters: {
    categories?: DeadlineCategory[];
    states?: string[];
    status?: Deadline['status'][];
    search?: string;
  }
): Deadline[] {
  return deadlines.filter((deadline) => {
    // Category filter
    if (filters.categories?.length && !filters.categories.includes(deadline.category)) {
      return false;
    }

    // State filter
    if (filters.states?.length && deadline.state && !filters.states.includes(deadline.state)) {
      return false;
    }

    // Status filter
    if (filters.status?.length && !filters.status.includes(deadline.status)) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = deadline.title.toLowerCase().includes(searchLower);
      const matchesDescription = deadline.description.toLowerCase().includes(searchLower);
      const matchesAgency = deadline.agency?.toLowerCase().includes(searchLower);

      if (!matchesTitle && !matchesDescription && !matchesAgency) {
        return false;
      }
    }

    return true;
  });
}

export function sortDeadlines(deadlines: Deadline[], sortBy: 'date' | 'priority' = 'date'): Deadline[] {
  return [...deadlines].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
