export interface Income {
  id: string;
  amount: number;
  date: string; // ISO date string
  note: string;
  source?: string; // Optional source of income (e.g., "Salary", "Freelance")
}

