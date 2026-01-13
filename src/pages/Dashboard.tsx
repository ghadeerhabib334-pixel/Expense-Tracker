import { useState, useEffect } from 'react';
import { useExpensesStore } from '../store/expensesStore';
import { ExpenseForm } from '../components/ExpenseForm';
import { IncomeForm } from '../components/IncomeForm';
import { ExpenseList } from '../components/ExpenseList';
import { BudgetCard } from '../components/BudgetCard';
import { Charts } from '../components/Charts';
import { ThemeToggle } from '../components/ThemeToggle';
import { formatCurrency, getDailyExpensesList } from '../utils/calculations';
import { Expense } from '../types/Expense';
import { Income } from '../types/Income';

export const Dashboard = () => {
  const expenses = useExpensesStore((state) => state.expenses);
  const walletTotal = useExpensesStore((state) => state.walletTotal);
  const loadData = useExpensesStore((state) => state.loadData);
  const deleteExpense = useExpensesStore((state) => state.deleteExpense);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [editingIncome, setEditingIncome] = useState<Income | undefined>();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const handleCloseExpenseForm = () => {
    setShowExpenseForm(false);
    setEditingExpense(undefined);
  };

  const handleCloseIncomeForm = () => {
    setShowIncomeForm(false);
    setEditingIncome(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Expense Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your spending and stay on budget</p>
          </div>
          <ThemeToggle />
        </header>

        <div className="space-y-6">
          {/* Wallet Total Card */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-xl p-6 text-white">
            <div>
              <h3 className="text-sm font-medium text-green-100 mb-1">Wallet Total</h3>
              <div className="text-3xl font-bold">{formatCurrency(walletTotal)}</div>
            </div>
          </div>

          <BudgetCard />

          <Charts expenses={expenses} />

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Expenses</h2>
            </div>
            <ExpenseList
              expenses={getDailyExpensesList(expenses)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-32 left-4 max-w-2xl mx-auto z-40">
          <button
            onClick={() => setShowExpenseForm(true)}
            className="w-14 h-14 bg-red-600 dark:bg-red-500 text-white rounded-full font-bold text-2xl shadow-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors flex items-center justify-center"
          >
            -
          </button>
        </div>

        {showExpenseForm && (
          <ExpenseForm
            onClose={handleCloseExpenseForm}
            initialExpense={editingExpense}
          />
        )}

        {showIncomeForm && (
          <IncomeForm
            onClose={handleCloseIncomeForm}
            initialIncome={editingIncome}
          />
        )}
      </div>
    </div>
  );
};

