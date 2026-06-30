export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  currency: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense' | 'saving';
  category: string;
  amount: number;
  description: string;
  date: Date | string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'saving';
  group: 'needs' | 'wants' | 'savings';
  icon: string;
}
