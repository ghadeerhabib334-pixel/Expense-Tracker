import { Expense } from '../types/Expense';
import { Income } from '../types/Income';
import { getDailyExpenses, getMonthlyExpenses as getMonthlyExpensesHelper } from './dateHelpers';

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

export const getTotalIncome = (income: Income[]): number => {
  return income.reduce((total, income) => total + income.amount, 0);
};

export const getWalletTotal = (income: Income[], expenses: Expense[]): number => {
  const totalIncome = getTotalIncome(income);
  const totalExpenses = getTotalSpent(expenses);
  return totalIncome - totalExpenses;
};

// Re-export formatDate from dateHelpers
export { formatDate } from './dateHelpers';

