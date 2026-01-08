# 💰 Web Expense Tracker – Development Plan

## 1. Project Overview

A responsive **web application** for managing personal expenses, optimized for **mobile-first usage** and usable like a lightweight mobile app.

**Goals:**

* Simple and fast expense tracking
* Clear insights into spending habits
* Works smoothly on mobile browsers
* Can be extended later (auth, sync, AI insights)

---

## 2. Target Users

* Individuals managing daily expenses
* Students with limited budgets
* Anyone who wants a simple mobile-friendly expense tracker

---

## 3. Core Features (MVP)

> **Currency:** All monetary values in the application use **RON (Romanian Leu)** as the default and only currency in MVP.

### 3.1 Expense Management

* Add expense (amount, category, date, note)
* Edit / delete expense
* Quick-add buttons for common expenses

### 3.2 Categories

* Default categories:

  * Food
  * Transport
  * Bills
  * Entertainment
  * Shopping
  * Other
* Add / edit / delete custom categories
* Color-coded categories

### 3.3 Budgeting & Limits

* Enter **daily spending limit**
* Enter **monthly spending limit**
* Monthly budget setup
* Remaining budget indicator
* Warning when exceeding daily or monthly limits

### 3.4 Analytics & Reports

#### 3.4.1 Daily Report

* List of **all expenses for selected day**
* Total sum of daily expenses

#### 3.4.2 Monthly Report

* List of **all expenses for selected month**
* Grouped or sortable by date
* Total monthly sum

#### 3.4.3 Visual Analytics

* Daily expenses slider
* Monthly expenses slider
* Category breakdown
* Simple charts (bar / pie)

### 3.5 Data Storage

* LocalStorage (no login required)
* Data persists between sessions

---

## 4. Non-Functional Requirements

* 🌙 / ☀️ **Dark / Light theme toggle** using moon/sun icon

* Theme preference persisted in LocalStorage

* Respects system theme on first load

* 📱 Mobile-first responsive design

* ⚡ Fast load & minimal UI

* 🔒 Privacy-first (no backend initially)

* ♿ Accessible (clear contrast, readable text)

---

## 5. Tech Stack

### Frontend

* **Framework:** React (Vite or Next.js)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State Management:** React Context or Zustand

### Charts

* Chart.js or Recharts

### Storage

* Browser LocalStorage (initial)
* Optional later: IndexedDB

---

## 6. Application Structure

```
/src
  /components
    ExpenseForm.tsx
    ExpenseList.tsx
    ExpenseItem.tsx
    CategorySelect.tsx
    BudgetCard.tsx
    ReportsDaily.tsx
    ReportsMonthly.tsx
    Charts.tsx

  /pages
    Dashboard.tsx
    Reports.tsx
    Limits.tsx

  /store
    expensesStore.ts

  /utils
    calculations.ts
    storage.ts
    dateHelpers.ts

  /types
    Expense.ts
    Category.ts
    Budget.ts
```

---

## 7. UX Flow

1. User opens app on mobile
2. Dashboard shows:

   * Remaining daily & monthly budget
   * Total spent today & this month
   * Sliders (daily / monthly)
3. User taps **Add Expense**
4. Bottom menu:

   * Dashboard
   * Add Expense
   * Reports
   * Limits
5. Expense instantly reflected in dashboard and reports

---

## 8. Milestones

### Milestone 1 – Setup

* Project setup (React + Tailwind)
* Mobile-first layout
* Basic navigation (bottom nav)

### Milestone 2 – Core Logic

* Expense CRUD
* Category management
* LocalStorage integration

### Milestone 3 – Budgeting

* Daily & monthly limits
* Remaining budget calculations
* Alerts & indicators

### Milestone 4 – Reports & Analytics

* Daily report view
* Monthly report view
* Charts & sliders

### Milestone 5 – Polish

* UI improvements
* Empty states
* Error handling

---

## 9. Future Enhancements

* PWA support (installable on mobile)
* Cloud sync
* User accounts
* AI spending insights
* Export to CSV

---

## 10. Definition of Done

* App works smoothly on mobile browsers
* Expenses persist after refresh
* Budget calculations are accurate
* Reports show correct totals
* UI is clean and intuitive

---

## 11. Cursor Instructions

* Start with MVP only
* Prioritize mobile UX
* Keep components small and reusable
* Write clean, readable TypeScript
* Avoid over-engineering

---

🚀 **Start with Dashboard + Add Expense flow first.**
