import { create } from 'zustand';
import { Expense } from '../types/Expense';
import { Income } from '../types/Income';
import { Category } from '../types/Category';
import { Budget } from '../types/Budget';
import { loadExpenses, saveExpenses, loadIncome, saveIncome, loadCategories, saveCategories, loadBudget, saveBudget, loadWalletTotal, saveWalletTotal } from '../utils/storage';

interface ExpensesStore {
  expenses: Expense[];
  income: Income[];
  categories: Category[];
  budget: Budget;
  walletTotal: number;
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
  setWalletTotal: (amount: number) => void;
  resetWalletTotal: () => void;
  loadData: () => void;
}

export const useExpensesStore = create<ExpensesStore>((set) => ({
  expenses: [],
  income: [],
  categories: [],
  budget: { dailyLimit: 0, monthlyLimit: 0 },
  walletTotal: 0,
  
  loadData: () => {
    const expenses = loadExpenses();
    const income = loadIncome();
    const savedCategories = loadCategories();
    const budget = loadBudget();
    const walletTotal = loadWalletTotal();
    set({ 
      expenses,
      income,
      categories: savedCategories || [],
      budget,
      walletTotal
    });
  },
  
  addExpense: (expense) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
    };
    set((state) => {
      const updatedExpenses = [...state.expenses, newExpense];
      const newWalletTotal = Math.max(0, state.walletTotal - newExpense.amount);
      saveExpenses(updatedExpenses);
      saveWalletTotal(newWalletTotal);
      return { expenses: updatedExpenses, walletTotal: newWalletTotal };
    });
  },
  
  updateExpense: (id, updates) => {
    set((state) => {
      const oldExpense = state.expenses.find((expense) => expense.id === id);
      const updatedExpenses = state.expenses.map((expense) =>
        expense.id === id ? { ...expense, ...updates } : expense
      );
      const updatedExpense = updatedExpenses.find((expense) => expense.id === id);
      
      // Calculate wallet total adjustment
      let walletAdjustment = 0;
      if (oldExpense && updatedExpense) {
        // Add back the old amount (undo original subtraction) and subtract the new amount
        walletAdjustment = oldExpense.amount - updatedExpense.amount;
      }
      
      const newWalletTotal = Math.max(0, state.walletTotal + walletAdjustment);
      saveExpenses(updatedExpenses);
      saveWalletTotal(newWalletTotal);
      return { expenses: updatedExpenses, walletTotal: newWalletTotal };
    });
  },
  
  deleteExpense: (id) => {
    set((state) => {
      const deletedExpense = state.expenses.find((expense) => expense.id === id);
      const updatedExpenses = state.expenses.filter((expense) => expense.id !== id);
      const newWalletTotal = deletedExpense 
        ? Math.max(0, state.walletTotal + deletedExpense.amount)
        : state.walletTotal;
      saveExpenses(updatedExpenses);
      saveWalletTotal(newWalletTotal);
      return { expenses: updatedExpenses, walletTotal: newWalletTotal };
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
      const newWalletTotal = state.walletTotal + newIncome.amount;
      saveIncome(updatedIncome);
      saveWalletTotal(newWalletTotal);
      return { income: updatedIncome, walletTotal: newWalletTotal };
    });
  },
  
  updateIncome: (id, updates) => {
    set((state) => {
      const oldIncome = state.income.find((income) => income.id === id);
      const updatedIncome = state.income.map((income) =>
        income.id === id ? { ...income, ...updates } : income
      );
      const updatedIncomeItem = updatedIncome.find((income) => income.id === id);
      
      // Calculate wallet total adjustment
      let walletAdjustment = 0;
      if (oldIncome && updatedIncomeItem) {
        // Subtract old amount (undo original addition) and add new amount
        walletAdjustment = updatedIncomeItem.amount - oldIncome.amount;
      }
      
      const newWalletTotal = Math.max(0, state.walletTotal + walletAdjustment);
      saveIncome(updatedIncome);
      saveWalletTotal(newWalletTotal);
      return { income: updatedIncome, walletTotal: newWalletTotal };
    });
  },
  
  deleteIncome: (id) => {
    set((state) => {
      const deletedIncome = state.income.find((income) => income.id === id);
      const updatedIncome = state.income.filter((income) => income.id !== id);
      const newWalletTotal = deletedIncome 
        ? Math.max(0, state.walletTotal - deletedIncome.amount)
        : state.walletTotal;
      saveIncome(updatedIncome);
      saveWalletTotal(newWalletTotal);
      return { income: updatedIncome, walletTotal: newWalletTotal };
    });
  },
  
  setWalletTotal: (amount) => {
    saveWalletTotal(amount);
    set({ walletTotal: amount });
  },
  
  resetWalletTotal: () => {
    saveWalletTotal(0);
    set({ walletTotal: 0 });
  },
}));
