import { create } from 'zustand';
import { Expense } from '../types/Expense';
import { Income } from '../types/Income';
import { Category } from '../types/Category';
import { Budget } from '../types/Budget';
import { loadExpenses, saveExpenses, loadIncome, saveIncome, loadCategories, saveCategories, loadBudget, saveBudget } from '../utils/storage';

interface ExpensesStore {
  expenses: Expense[];
  income: Income[];
  categories: Category[];
  budget: Budget;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  setBudget: (budget: Budget) => void;
  loadData: () => void;
}

export const useExpensesStore = create<ExpensesStore>((set) => ({
  expenses: [],
  income: [],
  categories: [],
  budget: { dailyLimit: 0, monthlyLimit: 0 },
  
  loadData: () => {
    const expenses = loadExpenses();
    const income = loadIncome();
    const savedCategories = loadCategories();
    const budget = loadBudget();
    set({ 
      expenses,
      income,
      categories: savedCategories || [],
      budget 
    });
  },
  
  addExpense: (expense) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
    };
    set((state) => {
      const updatedExpenses = [...state.expenses, newExpense];
      saveExpenses(updatedExpenses);
      return { expenses: updatedExpenses };
    });
  },
  
  updateExpense: (id, updates) => {
    set((state) => {
      const updatedExpenses = state.expenses.map((expense) =>
        expense.id === id ? { ...expense, ...updates } : expense
      );
      saveExpenses(updatedExpenses);
      return { expenses: updatedExpenses };
    });
  },
  
  deleteExpense: (id) => {
    set((state) => {
      const updatedExpenses = state.expenses.filter((expense) => expense.id !== id);
      saveExpenses(updatedExpenses);
      return { expenses: updatedExpenses };
    });
  },
  
  addCategory: (category) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
    };
    set((state) => {
      const updatedCategories = [...state.categories, newCategory];
      saveCategories(updatedCategories);
      return { categories: updatedCategories };
    });
  },
  
  updateCategory: (id, updates) => {
    set((state) => {
      const updatedCategories = state.categories.map((category) =>
        category.id === id ? { ...category, ...updates } : category
      );
      saveCategories(updatedCategories);
      return { categories: updatedCategories };
    });
  },
  
  deleteCategory: (id) => {
    set((state) => {
      // Don't allow deleting if expenses use it
      const hasExpenses = state.expenses.some(e => e.categoryId === id);
      if (hasExpenses) {
        return state; // Can't delete category with expenses
      }
      const updatedCategories = state.categories.filter((category) => category.id !== id);
      saveCategories(updatedCategories);
      return { categories: updatedCategories };
    });
  },
  
  setBudget: (budget) => {
    saveBudget(budget);
    set({ budget });
  },
  
  addIncome: (income) => {
    const newIncome: Income = {
      ...income,
      id: crypto.randomUUID(),
    };
    set((state) => {
      const updatedIncome = [...state.income, newIncome];
      saveIncome(updatedIncome);
      return { income: updatedIncome };
    });
  },
  
  updateIncome: (id, updates) => {
    set((state) => {
      const updatedIncome = state.income.map((income) =>
        income.id === id ? { ...income, ...updates } : income
      );
      saveIncome(updatedIncome);
      return { income: updatedIncome };
    });
  },
  
  deleteIncome: (id) => {
    set((state) => {
      const updatedIncome = state.income.filter((income) => income.id !== id);
      saveIncome(updatedIncome);
      return { income: updatedIncome };
    });
  },
}));
