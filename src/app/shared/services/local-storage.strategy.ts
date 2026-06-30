import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { StorageStrategy, TransactionFilters, CategoryFilters } from './storage-strategy.interface';
import { User, Transaction, Category } from '../models/budget.models';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageStrategy implements StorageStrategy {
  private readonly STORAGE_KEYS = {
    USER: 'demo_user',
    TRANSACTIONS: 'demo_transactions',
    CATEGORIES: 'demo_categories'
  };

  private readonly DEFAULT_CATEGORIES: Category[] = [
    // Income categories
    { id: 'cat_1', name: 'Salary', type: 'income', group: 'savings', icon: '💼' },
    { id: 'cat_2', name: 'Freelance', type: 'income', group: 'savings', icon: '💻' },
    { id: 'cat_3', name: 'Investments', type: 'income', group: 'savings', icon: '📈' },
    
    // Needs expense categories
    { id: 'cat_4', name: 'Rent', type: 'expense', group: 'needs', icon: '🏠' },
    { id: 'cat_5', name: 'Groceries', type: 'expense', group: 'needs', icon: '🛒' },
    { id: 'cat_6', name: 'Utilities', type: 'expense', group: 'needs', icon: '💡' },
    { id: 'cat_7', name: 'Transportation', type: 'expense', group: 'needs', icon: '🚗' },
    { id: 'cat_8', name: 'Healthcare', type: 'expense', group: 'needs', icon: '⚕️' },
    
    // Wants expense categories
    { id: 'cat_9', name: 'Entertainment', type: 'expense', group: 'wants', icon: '🎬' },
    { id: 'cat_10', name: 'Dining Out', type: 'expense', group: 'wants', icon: '🍽️' },
    { id: 'cat_11', name: 'Shopping', type: 'expense', group: 'wants', icon: '🛍️' },
    { id: 'cat_12', name: 'Travel', type: 'expense', group: 'wants', icon: '✈️' },
    
    // Savings categories
    { id: 'cat_13', name: 'Emergency Fund', type: 'saving', group: 'savings', icon: '🏦' },
    { id: 'cat_14', name: 'Retirement', type: 'saving', group: 'savings', icon: '🎯' },
    { id: 'cat_15', name: 'Vacation Fund', type: 'saving', group: 'savings', icon: '🏖️' }
  ];

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage(): void {
    if (!localStorage.getItem(this.STORAGE_KEYS.USER)) {
      const demoUser: User = {
        id: 'demo_user_1',
        name: 'Demo User',
        email: 'demo@example.com',
        currency: 'COP'
      };
      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(demoUser));
    }

    if (!localStorage.getItem(this.STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(this.STORAGE_KEYS.CATEGORIES, JSON.stringify(this.DEFAULT_CATEGORIES));
    }

    if (!localStorage.getItem(this.STORAGE_KEYS.TRANSACTIONS)) {
      localStorage.setItem(this.STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
    }
  }

  authenticateUser(email: string, password: string): Observable<User> {
    const user = this.getStoredUser();
    // In demo mode, we just return the demo user
    if (!user) {
      return throwError(() => new Error('Demo user not initialized'));
    }
    return of(user);
  }

  getUser(id: string): Observable<User> {
    const user = this.getStoredUser();
    return user ? of(user) : throwError(() => new Error('User not found'));
  }

  getTransactions(userId: string, filters?: TransactionFilters): Observable<Transaction[]> {
    const transactions = this.getStoredTransactions();
    let filtered = transactions.filter(t => t.user_id === userId);

    if (filters?.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters?.startDate || filters?.endDate) {
      filtered = filtered.filter(t => {
        const txDate = new Date(t.date);
        if (filters.startDate && txDate < filters.startDate) return false;
        if (filters.endDate && txDate > filters.endDate) return false;
        return true;
      });
    }

    if (filters?.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    return of(filtered);
  }

  getTransaction(id: string): Observable<Transaction> {
    const transactions = this.getStoredTransactions();
    const transaction = transactions.find(t => t.id === id);
    return transaction ? of(transaction) : throwError(() => new Error('Transaction not found'));
  }

  createTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    this.checkStorageSize();
    
    const transactions = this.getStoredTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: this.generateId()
    };
    
    transactions.push(newTransaction);
    localStorage.setItem(this.STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    
    return of(newTransaction);
  }

  updateTransaction(id: string, updates: Partial<Transaction>): Observable<Transaction> {
    const transactions = this.getStoredTransactions();
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Transaction not found'));
    }
    
    transactions[index] = { ...transactions[index], ...updates };
    localStorage.setItem(this.STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    
    return of(transactions[index]);
  }

  deleteTransaction(id: string): Observable<void> {
    const transactions = this.getStoredTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    
    if (transactions.length === filtered.length) {
      return throwError(() => new Error('Transaction not found'));
    }
    
    localStorage.setItem(this.STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filtered));
    return of(undefined);
  }

  getCategories(filters?: CategoryFilters): Observable<Category[]> {
    let categories = this.getStoredCategories();

    if (filters?.type) {
      categories = categories.filter(c => c.type === filters.type);
    }

    if (filters?.group) {
      categories = categories.filter(c => c.group === filters.group);
    }

    return of(categories);
  }

  getCategory(id: string): Observable<Category> {
    const categories = this.getStoredCategories();
    const category = categories.find(c => c.id === id);
    return category ? of(category) : throwError(() => new Error('Category not found'));
  }

  createCategory(category: Omit<Category, 'id'>): Observable<Category> {
    const categories = this.getStoredCategories();
    const newCategory: Category = {
      ...category,
      id: this.generateId()
    };
    
    categories.push(newCategory);
    localStorage.setItem(this.STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    
    return of(newCategory);
  }

  clearDemoData(): void {
    localStorage.removeItem(this.STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(this.STORAGE_KEYS.CATEGORIES);
    localStorage.setItem(this.STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
    localStorage.setItem(this.STORAGE_KEYS.CATEGORIES, JSON.stringify(this.DEFAULT_CATEGORIES));
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem(this.STORAGE_KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
  }

  private getStoredTransactions(): Transaction[] {
    const transactionsJson = localStorage.getItem(this.STORAGE_KEYS.TRANSACTIONS);
    return transactionsJson ? JSON.parse(transactionsJson) : [];
  }

  private getStoredCategories(): Category[] {
    const categoriesJson = localStorage.getItem(this.STORAGE_KEYS.CATEGORIES);
    return categoriesJson ? JSON.parse(categoriesJson) : [];
  }

  private generateId(): string {
    return `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private checkStorageSize(): void {
    const currentSize = new Blob(Object.values(localStorage)).size;
    const maxSize = 4 * 1024 * 1024; // 4MB threshold
    
    if (currentSize > maxSize) {
      throw new Error('Storage limit approaching. Please clear old data.');
    }
  }
}
