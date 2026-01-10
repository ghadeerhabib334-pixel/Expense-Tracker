import { useState, FormEvent } from 'react';
import { useExpensesStore } from '../store/expensesStore';
import { CategorySelect } from './CategorySelect';
import { getCurrentDateTimeString, getTodayDateString } from '../utils/dateHelpers';

interface ExpenseFormProps {
  onClose: () => void;
  initialExpense?: {
    id: string;
    amount: number;
    categoryId: string;
    date: string;
    note: string;
  };
}

export const ExpenseForm = ({ onClose, initialExpense }: ExpenseFormProps) => {
  const { addExpense, updateExpense, categories } = useExpensesStore();
  // When adding, always use current datetime. When editing, use the expense datetime.
  const [amount, setAmount] = useState(initialExpense?.amount.toString() || '');
  const [categoryId, setCategoryId] = useState(initialExpense?.categoryId || categories[0]?.id || '');
  
  // Extract date and time from existing expense or use current
  const getInitialDate = () => {
    if (initialExpense?.date) {
      const datePart = initialExpense.date.split('T')[0];
      return datePart;
    }
    return getTodayDateString();
  };
  
  const getInitialTime = () => {
    if (initialExpense?.date && initialExpense.date.includes('T')) {
      const timePart = initialExpense.date.split('T')[1];
      return timePart.substring(0, 5); // HH:mm
    }
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  const [date, setDate] = useState(getInitialDate());
  const [time, setTime] = useState(getInitialTime());
  const [note, setNote] = useState(initialExpense?.note || '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    if (!categoryId) {
      alert('Please select a category. If you have no categories, add one in the Settings page first.');
      return;
    }

    // Combine date and time into ISO datetime string
    const dateTimeString = `${date}T${time}:00`;

    if (initialExpense) {
      updateExpense(initialExpense.id, {
        amount: parseFloat(amount),
        categoryId,
        date: dateTimeString,
        note,
      });
    } else {
      // When adding new expense, use current datetime (get fresh to ensure it's current)
      const currentDateTime = getCurrentDateTimeString();
      addExpense({
        amount: parseFloat(amount),
        categoryId,
        date: currentDateTime,
        note,
      });
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {initialExpense ? 'Edit Expense' : 'Add Expense'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount (RON)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <CategorySelect value={categoryId} onChange={setCategoryId} />
          </div>

          {initialExpense && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Note (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a note..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            {initialExpense ? 'Update Expense' : 'Add Expense'}
          </button>
        </form>
      </div>
    </div>
  );
};

