import { Lead } from '../types/lead';

export function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getDate() === d2.getDate() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getFullYear() === d2.getFullYear();
}

export function isToday(dateString: string): boolean {
  const today = new Date();
  const date = new Date(dateString);
  return isSameDay(date, today);
}

export function isYesterday(dateString: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const date = new Date(dateString);
  return isSameDay(date, yesterday);
}

export function isLast7Days(dateString: string): boolean {
  const date = new Date(dateString);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return date > sevenDaysAgo && !isToday(dateString) && !isYesterday(dateString);
}

export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString(undefined, options);
  } catch (e) {
    return dateString;
  }
}

export type LeadGroup = 'Today' | 'Yesterday' | 'Last 7 Days' | 'Older';

export interface GroupedLeads {
  'Today': Lead[];
  'Yesterday': Lead[];
  'Last 7 Days': Lead[];
  'Older': Lead[];
}

export function groupLeadsByDate(leads: Lead[]): GroupedLeads {
  const groups: GroupedLeads = {
    'Today': [],
    'Yesterday': [],
    'Last 7 Days': [],
    'Older': []
  };

  leads.forEach(lead => {
    const dateString = lead.created_at;
    if (isToday(dateString)) {
      groups['Today'].push(lead);
    } else if (isYesterday(dateString)) {
      groups['Yesterday'].push(lead);
    } else if (isLast7Days(dateString)) {
      groups['Last 7 Days'].push(lead);
    } else {
      groups['Older'].push(lead);
    }
  });

  return groups;
}

