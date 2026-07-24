export type SourceCurrency = 'RON' | 'EUR';

export interface Source {
  id: string;
  name: string;
  value: number;
  currency: SourceCurrency;
}

