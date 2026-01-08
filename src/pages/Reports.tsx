import { useState } from 'react';
import { useExpensesStore } from '../store/expensesStore';
import { ReportsDaily } from '../components/ReportsDaily';
import { ReportsMonthly } from '../components/ReportsMonthly';
import { ExpenseForm } from '../components/ExpenseForm';
import { ThemeToggle } from '../components/ThemeToggle';
import { Expense } from '../types/Expense';

export const Reports = () => {
  const { deleteExpense } = useExpensesStore();
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExpense(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reports</h1>
            <p className="text-gray-600 dark:text-gray-400">View your spending by day or month</p>
          </div>
          <ThemeToggle />
        </header>

        <div className="mb-4">
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'daily'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'monthly'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {activeTab === 'daily' ? (
          <ReportsDaily onEdit={handleEdit} onDelete={handleDelete} />
        ) : (
          <ReportsMonthly onEdit={handleEdit} onDelete={handleDelete} />
        )}

        {showForm && (
          <ExpenseForm
            onClose={handleCloseForm}
            initialExpense={editingExpense}
          />
        )}
      </div>
    </div>
  );
};

