export type Unit = 'ud' | 'h' | 'l';
export interface Product {
  code: string;
  description: string;
  quantity: number | null;
  price: number | null;
  vatRate?: number;
  id?: string;
  unit?: Unit;
}
