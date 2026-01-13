import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Dashboard } from './pages/Dashboard';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Sources } from './pages/Sources';
import { Login } from './pages/Login';
import { BottomNav } from './components/BottomNav';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useState, useEffect } from 'react';
import { ExpenseForm } from './components/ExpenseForm';
import { IncomeForm } from './components/IncomeForm';
import { Expense } from './types/Expense';
import { Income } from './types/Income';
import { useAuthStore } from './store/authStore';

function App() {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [editingIncome, setEditingIncome] = useState<Income | undefined>();
  const loadAuth = useAuthStore((state) => state.loadAuth);
  const currentUser = useAuthStore((state) => state.currentUser);

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

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
          <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sources"
            element={
              <ProtectedRoute>
                <Sources />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
        {currentUser && <BottomNav />}
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

