import { Expense } from '../types/Expense';
import { Income } from '../types/Income';
import { getDailyExpenses, getMonthlyExpenses as getMonthlyExpensesHelper, getTodayDateString } from './dateHelpers';
import { format, addDays, parseISO, isBefore } from 'date-fns';

export const getDailyExpensesList = (expenses: Expense[], date: Date = new Date()): Expense[] => {
  return getDailyExpenses(expenses, date);
};

export const getMonthlyExpenses = (expenses: Expense[], date: Date = new Date()): Expense[] => {
  return getMonthlyExpensesHelper(expenses, date);
};

export const getTotalSpent = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const getCategoryTotals = (expenses: Expense[]): Record<string, number> => {
  return expenses.reduce((totals, expense) => {
    totals[expense.categoryId] = (totals[expense.categoryId] || 0) + expense.amount;
    return totals;
  }, {} as Record<string, number>);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
  }).format(amount);
};

export const formatCurrencyIn = (amount: number, currency: 'RON' | 'EUR'): string => {
  return new Intl.NumberFormat(currency === 'RON' ? 'ro-RO' : 'de-DE', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const getTotalIncome = (income: Income[]): number => {
  return income.reduce((total, income) => total + income.amount, 0);
};

export const getWalletTotal = (income: Income[], expenses: Expense[]): number => {
  const totalIncome = getTotalIncome(income);
  const totalExpenses = getTotalSpent(expenses);
  return totalIncome - totalExpenses;
};

export const calculateDailyCarryover = (expenses: Expense[], baseDailyLimit: number, carryoverResetDate?: string): number => {
  if (baseDailyLimit <= 0) return 0;
  
  // Group expenses by date
  const expensesByDate: Record<string, number> = {};
  expenses.forEach(expense => {
    const dateStr = expense.date.split('T')[0];
    expensesByDate[dateStr] = (expensesByDate[dateStr] || 0) + expense.amount;
  });
  
  // Get today's date
  const todayStr = getTodayDateString();
  const today = parseISO(todayStr);
  
  // Determine start date: use carryoverResetDate if provided, otherwise use 90 days ago
  let startDate: Date;
  if (carryoverResetDate) {
    startDate = parseISO(carryoverResetDate);
    // If reset date is today or in the future, there's no carryover yet
    // We need to check if reset date is strictly before today (not equal)
    const resetDateStr = format(startDate, 'yyyy-MM-dd');
    if (resetDateStr >= todayStr) {
      return 0; // Reset date is today or in the future, no carryover
    }
  } else {
    // Limit lookback to last 90 days for performance (adjustable)
    const maxLookbackDays = 90;
    startDate = addDays(today, -maxLookbackDays);
  }
  
  // Calculate cumulative carryover sequentially:
  // Go through each day from the day AFTER reset date (or start date) to today, calculating carryover
  // Each day gets base limit + unused amount from previous day
  let carryover = 0;
  // Start from the day after reset date (or start date) if reset date was set
  let currentDate = carryoverResetDate ? addDays(startDate, 1) : startDate;
  
  // Only process days strictly before today
  while (isBefore(currentDate, today)) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    
    // Calculate effective limit for this day (base + carryover from previous day)
    const effectiveLimit = baseDailyLimit + carryover;
    const spent = expensesByDate[dateStr] || 0;
    
    // Unused amount carries over to next day
    const unused = Math.max(0, effectiveLimit - spent);
    carryover = unused;
    
    // Move to next day
    currentDate = addDays(currentDate, 1);
  }
  
  return carryover;
};

export const getEffectiveDailyLimit = (expenses: Expense[], baseDailyLimit: number, carryoverResetDate?: string): number => {
  const carryover = calculateDailyCarryover(expenses, baseDailyLimit, carryoverResetDate);
  return baseDailyLimit + carryover;
};

// Re-export formatDate from dateHelpers
export { formatDate } from './dateHelpers';
