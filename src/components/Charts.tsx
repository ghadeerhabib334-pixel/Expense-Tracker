import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Expense } from '../types/Expense';
import { useExpensesStore } from '../store/expensesStore';
import { getMonthlyExpenses, getCategoryTotals, formatCurrency } from '../utils/calculations';

interface ChartsProps {
  expenses: Expense[];
}

export const Charts = ({ expenses }: ChartsProps) => {
  const { categories } = useExpensesStore();
  const monthlyExpenses = getMonthlyExpenses(expenses);
  const categoryTotals = getCategoryTotals(monthlyExpenses);

  const chartData = categories.map((category) => ({
    name: category.name,
    value: categoryTotals[category.id] || 0,
    color: category.color,
  })).filter(item => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          No data to display yet
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{payload[0].name}</p>
          <p className="text-blue-600 dark:text-blue-400">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

