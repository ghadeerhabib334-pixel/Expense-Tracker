import { useState } from 'react';
import { Expense } from '../types/Expense';
import { useExpensesStore } from '../store/expensesStore';
import { getMonthlyExpenses, getTotalSpent, formatCurrency } from '../utils/calculations';
import { ExpenseItem } from './ExpenseItem';
import { format, subMonths, addMonths, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface ReportsMonthlyProps {
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ReportsMonthly = ({ onEdit, onDelete }: ReportsMonthlyProps) => {
  const { expenses } = useExpensesStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  
  const monthlyExpenses = getMonthlyExpenses(expenses, selectedMonth);
  const totalSpent = getTotalSpent(monthlyExpenses);

  // Group expenses by date (extract date part from datetime string)
  const expensesByDate = monthlyExpenses.reduce((acc, expense) => {
    const dateKey = expense.date.split('T')[0]; // Get just the date part
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(expense);
    return acc;
  }, {} as Record<string, typeof monthlyExpenses>);
  
  // Sort expenses within each day by time (newest first)
  Object.keys(expensesByDate).forEach(dateKey => {
    expensesByDate[dateKey].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Newest first
    });
  });

  const goToPreviousMonth = () => {
    setSelectedMonth(subMonths(selectedMonth, 1));
  };

  const goToNextMonth = () => {
    setSelectedMonth(addMonths(selectedMonth, 1));
  };

  const goToCurrentMonth = () => {
    setSelectedMonth(new Date());
  };

  const isCurrentMonth = isSameMonth(selectedMonth, new Date());

  // Get all days in the selected month
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Report</h3>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(totalSpent)}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex-1 text-center">
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              {format(selectedMonth, 'MMMM yyyy')}
            </div>
            {!isCurrentMonth && (
              <button
                onClick={goToCurrentMonth}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
              >
                Go to Current Month
              </button>
            )}
          </div>

          <button
            onClick={goToNextMonth}
            disabled={isCurrentMonth}
            className={`p-2 rounded-lg transition-colors ${
              isCurrentMonth
                ? 'bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {monthlyExpenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No expenses for this month
        </div>
      ) : (
        <div className="space-y-4">
          {daysInMonth.map((day) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayExpenses = expensesByDate[dayKey] || [];
            if (dayExpenses.length === 0) return null;

            const dayTotal = getTotalSpent(dayExpenses);

            return (
              <div key={day.toISOString()} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {format(day, 'dd MMMM yyyy')}
                  </h4>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {formatCurrency(dayTotal)}
                  </span>
                </div>
                <div className="space-y-2">
                  {dayExpenses.map((expense) => (
                    <ExpenseItem
                      key={expense.id}
                      expense={expense}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

