export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  date: string; // ISO date string
  note: string;
}

