import { useState, FormEvent } from 'react';
import { useExpensesStore } from '../store/expensesStore';
import { getTodayDateString } from '../utils/dateHelpers';

interface IncomeFormProps {
  onClose: () => void;
  initialIncome?: {
    id: string;
    amount: number;
    date: string;
    note: string;
    source?: string;
  };
}

export const IncomeForm = ({ onClose, initialIncome }: IncomeFormProps) => {
  const { addIncome, updateIncome } = useExpensesStore();
  // When adding, always use today's date. When editing, use the income date.
  const todayDate = getTodayDateString();
  const [amount, setAmount] = useState(initialIncome?.amount.toString() || '');
  const [date, setDate] = useState(initialIncome?.date || todayDate);
  const [note, setNote] = useState(initialIncome?.note || '');
  const [source, setSource] = useState(initialIncome?.source || '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    if (initialIncome) {
      updateIncome(initialIncome.id, {
        amount: parseFloat(amount),
        date,
        note,
        source: source || undefined,
      });
    } else {
      // When adding new income, always use today's date (get fresh date to ensure it's current)
      const currentDate = getTodayDateString();
      addIncome({
        amount: parseFloat(amount),
        date: currentDate,
        note,
        source: source || undefined,
      });
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {initialIncome ? 'Edit Income' : 'Add Income'}
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Source (optional)
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Salary, Freelance, Gift"
            />
          </div>

          {initialIncome && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Note (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Add a note..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 dark:bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
          >
            {initialIncome ? 'Update Income' : 'Add Income'}
          </button>
        </form>
      </div>
    </div>
  );
};

