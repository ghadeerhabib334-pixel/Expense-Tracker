import { useExpensesStore } from '../store/expensesStore';
import { getDailyExpensesList, getMonthlyExpenses, getTotalSpent, formatCurrency, getEffectiveDailyLimit, calculateDailyCarryover } from '../utils/calculations';

export const BudgetCard = () => {
  const { expenses, budget } = useExpensesStore();
  const dailyExpenses = getDailyExpensesList(expenses);
  const monthlyExpenses = getMonthlyExpenses(expenses);
  const dailySpent = getTotalSpent(dailyExpenses);
  const monthlySpent = getTotalSpent(monthlyExpenses);
  
  // Calculate cumulative daily limit (base + carryover from previous days)
  const carryover = calculateDailyCarryover(expenses, budget.dailyLimit, budget.carryoverResetDate);
  const effectiveDailyLimit = getEffectiveDailyLimit(expenses, budget.dailyLimit, budget.carryoverResetDate);
  
  const dailyRemaining = effectiveDailyLimit - dailySpent;
  const monthlyRemaining = budget.monthlyLimit - monthlySpent;
  const dailyPercentage = effectiveDailyLimit > 0 ? (dailySpent / effectiveDailyLimit) * 100 : 0;
  const monthlyPercentage = budget.monthlyLimit > 0 ? (monthlySpent / budget.monthlyLimit) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Daily Budget Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-medium text-blue-100 mb-1">Daily Limit</h3>
            <div className="text-3xl font-bold">{formatCurrency(effectiveDailyLimit)}</div>
            {carryover > 0 && (
              <div className="text-xs text-blue-200 mt-1">
                Base: {formatCurrency(budget.dailyLimit)} + Carryover: {formatCurrency(carryover)}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100 mb-1">Spent Today</div>
            <div className="text-2xl font-bold">{formatCurrency(dailySpent)}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-blue-100">Remaining</span>
            <span className={`font-semibold ${dailyRemaining < 0 ? 'text-red-200' : 'text-green-200'}`}>
              {formatCurrency(dailyRemaining)}
            </span>
          </div>
          <div className="w-full bg-blue-500 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                dailyPercentage > 100 ? 'bg-red-400' : dailyPercentage > 80 ? 'bg-yellow-300' : 'bg-green-300'
              }`}
              style={{ width: `${Math.min(dailyPercentage, 100)}%` }}
            />
          </div>
        </div>

        {effectiveDailyLimit > 0 && dailyPercentage > 100 && (
          <div className="mt-3 p-2 bg-red-500/30 rounded-lg text-sm text-red-100">
            ⚠️ You've exceeded your daily limit!
          </div>
        )}
      </div>

      {/* Monthly Budget Card */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-medium text-purple-100 mb-1">Monthly Limit</h3>
            <div className="text-3xl font-bold">{formatCurrency(budget.monthlyLimit)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-purple-100 mb-1">Spent This Month</div>
            <div className="text-2xl font-bold">{formatCurrency(monthlySpent)}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-purple-100">Remaining</span>
            <span className={`font-semibold ${monthlyRemaining < 0 ? 'text-red-200' : 'text-green-200'}`}>
              {formatCurrency(monthlyRemaining)}
            </span>
          </div>
          <div className="w-full bg-purple-500 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                monthlyPercentage > 100 ? 'bg-red-400' : monthlyPercentage > 80 ? 'bg-yellow-300' : 'bg-green-300'
              }`}
              style={{ width: `${Math.min(monthlyPercentage, 100)}%` }}
            />
          </div>
        </div>

        {budget.monthlyLimit > 0 && monthlyPercentage > 100 && (
          <div className="mt-3 p-2 bg-red-500/30 rounded-lg text-sm text-red-100">
            ⚠️ You've exceeded your monthly limit!
          </div>
        )}
      </div>
    </div>
  );
};

