import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, isWithinInterval, parseISO, isSameDay, isSameMonth } from 'date-fns';

import { Expense } from '../types/Expense';

export const getDailyExpenses = (expenses: Expense[], date: Date = new Date()): Expense[] => {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  
  return expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return isWithinInterval(expenseDate, { start: dayStart, end: dayEnd });
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

