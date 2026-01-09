import { useState, useEffect } from 'react';
import { useExpensesStore } from '../store/expensesStore';
import { ExpenseForm } from '../components/ExpenseForm';
import { IncomeForm } from '../components/IncomeForm';
import { ExpenseList } from '../components/ExpenseList';
import { BudgetCard } from '../components/BudgetCard';
import { Charts } from '../components/Charts';
import { ThemeToggle } from '../components/ThemeToggle';
import { Expense } from '../types/Expense';
import { Income } from '../types/Income';

export const Dashboard = () => {
  const { expenses, loadData, deleteExpense } = useExpensesStore();
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
          <BudgetCard />

          <Charts expenses={expenses} />

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Expenses</h2>
            </div>
            <ExpenseList
              expenses={expenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
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

