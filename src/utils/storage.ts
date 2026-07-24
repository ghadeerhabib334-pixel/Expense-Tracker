import { Expense } from '../types/Expense';
import { Income } from '../types/Income';
import { Category } from '../types/Category';
import { Budget } from '../types/Budget';
import { Source } from '../types/Source';

const STORAGE_KEY = 'expense-tracker-data';
const INCOME_KEY = 'expense-tracker-income';
const CATEGORIES_KEY = 'expense-tracker-categories';
const BUDGET_KEY = 'expense-tracker-budget';
const THEME_KEY = 'expense-tracker-theme';
const WALLET_TOTAL_KEY = 'expense-tracker-wallet-total';
const SOURCES_KEY = 'expense-tracker-sources';

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
      // Ensure carryoverResetDate exists for old budgets
      if (!parsed.carryoverResetDate) {
        return { ...parsed, carryoverResetDate: undefined };
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

export const loadWalletTotal = (): number => {
  try {
    const data = localStorage.getItem(WALLET_TOTAL_KEY);
    return data ? parseFloat(data) : 0;
  } catch {
    return 0;
  }
};

export const saveWalletTotal = (walletTotal: number): void => {
  try {
    localStorage.setItem(WALLET_TOTAL_KEY, walletTotal.toString());
  } catch (error) {
    console.error('Failed to save wallet total:', error);
  }
};

export const loadSources = (): Source[] => {
  try {
    const data = localStorage.getItem(SOURCES_KEY);
    const sources: Array<Partial<Source> & Pick<Source, 'id' | 'name' | 'value'>> = data ? JSON.parse(data) : [];
    // Existing sources were stored in lei before currency selection was added.
    return sources.map((source) => ({ ...source, currency: source.currency || 'RON' }));
  } catch {
    return [];
  }
};

export const saveSources = (sources: Source[]): void => {
  try {
    localStorage.setItem(SOURCES_KEY, JSON.stringify(sources));
  } catch (error) {
    console.error('Failed to save sources:', error);
  }
};
