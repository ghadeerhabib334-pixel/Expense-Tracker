import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Dashboard } from './pages/Dashboard';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Sources } from './pages/Sources';
import { BottomNav } from './components/BottomNav';
import { useState } from 'react';
import { ExpenseForm } from './components/ExpenseForm';
import { IncomeForm } from './components/IncomeForm';
import { Expense } from './types/Expense';
import { Income } from './types/Income';

function App() {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [editingIncome, setEditingIncome] = useState<Income | undefined>();

  const handleCloseExpenseForm = () => {
    setShowExpenseForm(false);
    setEditingExpense(undefined);
  };

  const handleCloseIncomeForm = () => {
    setShowIncomeForm(false);
    setEditingIncome(undefined);
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sources" element={<Sources />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <BottomNav />
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
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App

