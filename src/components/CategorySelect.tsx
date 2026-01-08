import { useExpensesStore } from '../store/expensesStore';

interface CategorySelectProps {
  value: string;
  onChange: (categoryId: string) => void;
}

export const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  const { categories } = useExpensesStore();
  
  if (categories.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
        No categories available. Please add a category in the Settings page first.
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-3 gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={`
            p-3 rounded-lg border-2 transition-all
            ${value === category.id 
              ? 'border-gray-800 dark:border-gray-200 bg-gray-100 dark:bg-gray-700' 
              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }
          `}
        >
          <div
            className="w-6 h-6 rounded-full mx-auto mb-1"
            style={{ backgroundColor: category.color }}
          />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
        </button>
      ))}
    </div>
  );
};

