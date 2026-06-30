import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { TransactionsService } from './transactions.service';
import { CategoriesService } from './categories.service';
import { AuthenticationService } from './authentication.service';
import { DateRangeService } from './date-range.service';
import { Transaction, Category } from '../models/budget.models';

export interface DashboardSummary {
  totalIncome: number;
  totalSavings: number;
  totalNeedsExpenses: number;
  totalWantsExpenses: number;
}

export interface ExpenseByCategory {
  category: string;
  amount: number;
  categoryIcon: string;
  percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardStateService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  transactions$ = this.transactionsSubject.asObservable();
  categories$ = this.categoriesSubject.asObservable();
  isLoading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private authService: AuthenticationService,
    private dateRangeService: DateRangeService
  ) {
    this.initializeAutoRefresh();
  }

  private initializeAutoRefresh(): void {
    // Auto-refresh when date range changes
    this.dateRangeService.currentRange$.subscribe(() => {
      this.refreshData();
    });
  }

  refreshData(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.errorSubject.next('User not authenticated');
      return;
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const dateRange = this.dateRangeService.getCurrentRange();

    combineLatest([
      this.transactionsService.getTransactions(userId, {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      }),
      this.categoriesService.getCategories()
    ]).pipe(
      catchError(error => {
        this.errorSubject.next(error.message || 'Failed to load data');
        this.loadingSubject.next(false);
        return [[], []];
      })
    ).subscribe(([transactions, categories]) => {
      this.transactionsSubject.next(transactions);
      this.categoriesSubject.next(categories);
      this.loadingSubject.next(false);
    });
  }

  getSummary(): Observable<DashboardSummary> {
    return this.transactions$.pipe(
      map(transactions => {
        const income = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);

        const savings = transactions
          .filter(t => t.type === 'saving')
          .reduce((sum, t) => sum + t.amount, 0);

        const needsExpenses = transactions
          .filter(t => t.type === 'expense')
          .filter(t => this.getCategoryGroup(t.category) === 'needs')
          .reduce((sum, t) => sum + t.amount, 0);

        const wantsExpenses = transactions
          .filter(t => t.type === 'expense')
          .filter(t => this.getCategoryGroup(t.category) === 'wants')
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          totalIncome: income,
          totalSavings: savings,
          totalNeedsExpenses: needsExpenses,
          totalWantsExpenses: wantsExpenses
        };
      })
    );
  }

  getExpensesByCategory(group: 'needs' | 'wants'): Observable<ExpenseByCategory[]> {
    return combineLatest([this.transactions$, this.categories$]).pipe(
      map(([transactions, categories]) => {
        const expenseTransactions = transactions.filter(t => {
          if (t.type !== 'expense') return false;
          const categoryGroup = this.getCategoryGroup(t.category);
          return categoryGroup === group;
        });

        const total = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

        // Group by category
        const categoryMap = new Map<string, { amount: number; icon: string }>();

        expenseTransactions.forEach(t => {
          const category = categories.find(c => c.id === t.category || c.name === t.category);
          const categoryName = category?.name || t.category;
          const icon = category?.icon || '💰';

          if (categoryMap.has(categoryName)) {
            const existing = categoryMap.get(categoryName)!;
            existing.amount += t.amount;
          } else {
            categoryMap.set(categoryName, { amount: t.amount, icon });
          }
        });

        // Convert to array and calculate percentages
        return Array.from(categoryMap.entries()).map(([category, data]) => ({
          category,
          amount: data.amount,
          categoryIcon: data.icon,
          percentage: total > 0 ? (data.amount / total) * 100 : 0
        }));
      })
    );
  }

  getTransactionsByType(type: 'income' | 'expense' | 'saving', group?: 'needs' | 'wants'): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map(transactions => {
        let filtered = transactions.filter(t => t.type === type);

        if (type === 'expense' && group) {
          filtered = filtered.filter(t => this.getCategoryGroup(t.category) === group);
        }

        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      })
    );
  }

  private getCategoryGroup(categoryId: string): 'needs' | 'wants' | 'savings' {
    const categories = this.categoriesSubject.value;
    const category = categories.find(c => c.id === categoryId || c.name === categoryId);
    return category?.group || 'needs';
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    return this.transactionsService.createTransaction(transaction).pipe(
      switchMap(newTransaction => {
        const userId = this.authService.getCurrentUserId();
        const dateRange = this.dateRangeService.getCurrentRange();
        
        return combineLatest([
          this.transactionsService.getTransactions(userId!, {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
          }),
          this.categoriesService.getCategories()
        ]).pipe(
          map(([transactions, categories]) => {
            this.transactionsSubject.next(transactions);
            this.categoriesSubject.next(categories);
            return newTransaction;
          })
        );
      })
    );
  }

  updateTransaction(id: string, updates: Partial<Transaction>): Observable<Transaction> {
    return this.transactionsService.updateTransaction(id, updates).pipe(
      switchMap(updated => {
        const userId = this.authService.getCurrentUserId();
        const dateRange = this.dateRangeService.getCurrentRange();
        
        return combineLatest([
          this.transactionsService.getTransactions(userId!, {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
          }),
          this.categoriesService.getCategories()
        ]).pipe(
          map(([transactions, categories]) => {
            this.transactionsSubject.next(transactions);
            this.categoriesSubject.next(categories);
            return updated;
          })
        );
      })
    );
  }

  deleteTransaction(id: string): Observable<void> {
    return this.transactionsService.deleteTransaction(id).pipe(
      switchMap(() => {
        const userId = this.authService.getCurrentUserId();
        const dateRange = this.dateRangeService.getCurrentRange();
        
        return combineLatest([
          this.transactionsService.getTransactions(userId!, {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
          }),
          this.categoriesService.getCategories()
        ]).pipe(
          map(([transactions, categories]) => {
            this.transactionsSubject.next(transactions);
            this.categoriesSubject.next(categories);
          })
        );
      })
    );
  }
}
