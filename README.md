# 💰 Web Expense Tracker

A responsive web application for managing personal expenses, optimized for mobile-first usage.

## Features

- ✅ Add, edit, and delete expenses
- ✅ Category-based organization (Food, Transport, Bills, Entertainment, Shopping, Other)
- ✅ Monthly budget tracking with visual indicators
- ✅ Spending analytics with category breakdown charts
- ✅ Local storage persistence (no login required)
- ✅ Mobile-first responsive design

## Tech Stack

- **React** with **Vite**
- **TypeScript**
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Recharts** for data visualization
- **date-fns** for date handling

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
/src
  /components
    ExpenseForm.tsx      # Form for adding/editing expenses
    ExpenseList.tsx      # List of expenses
    ExpenseItem.tsx      # Individual expense item
    CategorySelect.tsx   # Category selection component
    BudgetCard.tsx       # Budget display and management
    Charts.tsx           # Spending charts

  /pages
    Dashboard.tsx        # Main dashboard page

  /store
    expensesStore.ts     # Zustand store for state management

  /utils
    calculations.ts      # Helper functions for calculations
    storage.ts           # LocalStorage utilities

  /types
    Expense.ts           # Expense type definition
    Category.ts          # Category type definition
```

## Usage

1. **Set Your Budget**: Enter your monthly budget in the budget card
2. **Add Expenses**: Click the "+" button to add a new expense
3. **Track Spending**: View your spending breakdown by category in the charts
4. **Manage Expenses**: Edit or delete expenses by clicking the respective icons

## Future Enhancements

- PWA support (installable on mobile)
- Cloud sync
- User accounts
- AI spending insights
- Export to CSV

## License

MIT

