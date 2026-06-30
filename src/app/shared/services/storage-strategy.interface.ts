import { Observable } from 'rxjs';
import { User, Transaction, Category } from '../models/budget.models';

export interface StorageStrategy {
  // User operations
  authenticateUser(email: string, password: string): Observable<User>;
  getUser(id: string): Observable<User>;
  
  // Transaction operations
  getTransactions(userId: string, filters?: TransactionFilters): Observable<Transaction[]>;
  getTransaction(id: string): Observable<Transaction>;
  createTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction>;
  updateTransaction(id: string, transaction: Partial<Transaction>): Observable<Transaction>;
  deleteTransaction(id: string): Observable<void>;
  
  // Category operations
  getCategories(filters?: CategoryFilters): Observable<Category[]>;
  getCategory(id: string): Observable<Category>;
  createCategory(category: Omit<Category, 'id'>): Observable<Category>;
}

export interface TransactionFilters {
  type?: 'income' | 'expense' | 'saving';
  startDate?: Date;
  endDate?: Date;
  category?: string;
}

export interface CategoryFilters {
  type?: 'income' | 'expense' | 'saving';
  group?: 'needs' | 'wants' | 'savings';
}
