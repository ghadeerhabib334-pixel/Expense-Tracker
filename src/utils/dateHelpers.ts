import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO, isSameDay, isSameMonth } from 'date-fns';

import { Expense } from '../types/Expense';

// Get today's date in local timezone as YYYY-MM-DD string
export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDailyExpenses = (expenses: Expense[], date: Date = new Date()): Expense[] => {
  const targetDateString = format(date, 'yyyy-MM-dd');
  
  return expenses.filter(expense => {
    // Compare date strings directly to avoid timezone issues
    const expenseDateString = expense.date.split('T')[0];
    return expenseDateString === targetDateString;
  });
};

export const getMonthlyExpenses = (expenses: Expense[], date: Date = new Date()): Expense[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  
  return expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
  });
};

export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM dd, yyyy');
};

export const formatDateShort = (dateString: string): string => {
  return format(parseISO(dateString), 'dd MMM');
};

export const formatDateFull = (dateString: string): string => {
  // Ensure we have a valid ISO date string
  const isoString = dateString.includes('T') ? dateString : `${dateString}T00:00:00`;
  return format(parseISO(isoString), 'dd MMMM yyyy');
};

export const isToday = (dateString: string): boolean => {
  return isSameDay(parseISO(dateString), new Date());
};

export const isThisMonth = (dateString: string): boolean => {
  return isSameMonth(parseISO(dateString), new Date());
};

// Format datetime string to show date and time
export const formatDateTime = (dateTimeString: string): string => {
  // Handle backward compatibility: if it's just a date, add time
  const isoString = dateTimeString.includes('T') ? dateTimeString : `${dateTimeString}T00:00:00`;
  const date = parseISO(isoString);
  // Only show time if it's not midnight (00:00:00)
  const hasTime = dateTimeString.includes('T') && !dateTimeString.endsWith('T00:00:00');
  if (hasTime) {
    return format(date, 'dd MMM yyyy, HH:mm');
  }
  return format(date, 'dd MMM yyyy');
};

// Format time from datetime string (HH:mm)
export const formatTime = (dateTimeString: string): string => {
  if (!dateTimeString.includes('T')) return '';
  
  // Extract time part from datetime string
  const timePart = dateTimeString.split('T')[1];
  if (!timePart) return '';
  
  // Handle different time formats: "HH:mm:ss" or "HH:mm" or just "HH"
  const timeMatch = timePart.match(/^(\d{1,2}):(\d{2})(?::\d{2})?/);
  if (!timeMatch) return '';
  
  const hours = String(parseInt(timeMatch[1], 10)).padStart(2, '0');
  const minutes = timeMatch[2];
  
  return `${hours}:${minutes}`;
};

// Get current datetime as ISO string (YYYY-MM-DDTHH:mm:ss)
export const getCurrentDateTimeString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
