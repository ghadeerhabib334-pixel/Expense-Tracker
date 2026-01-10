export interface Budget {
  dailyLimit: number;
  monthlyLimit: number;
  carryoverResetDate?: string; // Date string (YYYY-MM-DD) when carryover was last reset
}

