import { Expense } from '../types/Expense';
import { Income } from '../types/Income';
import { Category } from '../types/Category';
import { Budget } from '../types/Budget';

const STORAGE_KEY = 'expense-tracker-data';
const INCOME_KEY = 'expense-tracker-income';
const CATEGORIES_KEY = 'expense-tracker-categories';
const BUDGET_KEY = 'expense-tracker-budget';
const THEME_KEY = 'expense-tracker-theme';

export const loadExpenses = (): Expense[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveExpenses = (expenses: Expense[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error('Failed to save expenses:', error);
  }
};

export const loadCategories = (): Category[] | null => {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save categories:', error);
  }
};

export const loadBudget = (): Budget => {
  try {
    const data = localStorage.getItem(BUDGET_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Handle migration from old format (single number) to new format
      if (typeof parsed === 'number') {
        return { dailyLimit: 0, monthlyLimit: parsed };
      }
      return parsed;
    }
    return { dailyLimit: 0, monthlyLimit: 0 };
  } catch {
    return { dailyLimit: 0, monthlyLimit: 0 };
  }
};

export const saveBudget = (budget: Budget): void => {
  try {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(budget));
  } catch (error) {
    console.error('Failed to save budget:', error);
  }
};

export const loadTheme = (): 'light' | 'dark' => {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    if (theme === 'light' || theme === 'dark') {
      return theme;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
};

export const saveTheme = (theme: 'light' | 'dark'): void => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
};

export const loadIncome = (): Income[] => {
  try {
    const data = localStorage.getItem(INCOME_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveIncome = (income: Income[]): void => {
  try {
    localStorage.setItem(INCOME_KEY, JSON.stringify(income));
  } catch (error) {
    console.error('Failed to save income:', error);
  }
};

