import { useState } from 'react';
import { Expense } from '../types/Expense';
import { useExpensesStore } from '../store/expensesStore';
import { getDailyExpensesList, getTotalSpent, formatCurrency } from '../utils/calculations';
import { ExpenseItem } from './ExpenseItem';
import { subDays, addDays, isSameDay, format } from 'date-fns';

interface ReportsDailyProps {
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ReportsDaily = ({ onEdit, onDelete }: ReportsDailyProps) => {
  const { expenses } = useExpensesStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const dailyExpenses = getDailyExpensesList(expenses, selectedDate);
  // Sort expenses by time (newest first)
  const sortedDailyExpenses = [...dailyExpenses].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // Newest first
  });
  const totalSpent = getTotalSpent(dailyExpenses);

  const goToPreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const goToNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const isToday = isSameDay(selectedDate, new Date());

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Report</h3>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(totalSpent)}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={goToPreviousDay}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

            <div className="flex-1 text-center">
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                {format(selectedDate, 'dd MMMM yyyy')}
              </div>
            {!isToday && (
              <button
                onClick={goToToday}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
              >
                Go to Today
              </button>
            )}
          </div>

          <button
            onClick={goToNextDay}
            disabled={isToday}
            className={`p-2 rounded-lg transition-colors ${
              isToday
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

      {sortedDailyExpenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No expenses for this day
        </div>
      ) : (
        <div className="space-y-2">
          {sortedDailyExpenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

