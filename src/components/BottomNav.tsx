import { useLocation, useNavigate } from 'react-router-dom';

interface BottomNavProps {
  onAddExpense: () => void;
  onAddIncome: () => void;
}

export const BottomNav = ({ onAddExpense, onAddIncome }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-around items-center h-20">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              isActive('/') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Dashboard</span>
          </button>

          {location.pathname === '/' && (
            <>
              <button
                onClick={onAddIncome}
                className="fixed left-6 bottom-24 w-14 h-14 bg-green-600 dark:bg-green-500 text-white rounded-full shadow-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center justify-center text-2xl font-bold z-40"
                aria-label="Add income"
                title="Add Income"
              >
                +
              </button>

              <button
                onClick={onAddExpense}
                className="fixed right-6 bottom-24 w-14 h-14 bg-red-600 dark:bg-red-500 text-white rounded-full shadow-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors flex items-center justify-center text-2xl font-bold z-40"
                aria-label="Add expense"
                title="Add Expense"
              >
                −
              </button>
            </>
          )}

          <button
            onClick={() => navigate('/reports')}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              isActive('/reports') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs">Reports</span>
          </button>

          <button
            onClick={() => navigate('/settings')}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              isActive('/settings') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

