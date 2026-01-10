export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  date: string; // ISO datetime string (YYYY-MM-DDTHH:mm:ss) or date string (YYYY-MM-DD) for backward compatibility
  note: string;
}

