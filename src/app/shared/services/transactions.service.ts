import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageProviderService } from './storage-provider.service';
import { Transaction } from '../models/budget.models';
import { TransactionFilters } from './storage-strategy.interface';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  constructor(private storageProvider: StorageProviderService) {}

  getTransactions(userId: string, filters?: TransactionFilters): Observable<Transaction[]> {
    return this.storageProvider.getStrategy().getTransactions(userId, filters);
  }

  getTransaction(id: string): Observable<Transaction> {
    return this.storageProvider.getStrategy().getTransaction(id);
  }

  createTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    return this.storageProvider.getStrategy().createTransaction(transaction);
  }

  updateTransaction(id: string, transaction: Partial<Transaction>): Observable<Transaction> {
    return this.storageProvider.getStrategy().updateTransaction(id, transaction);
  }

  deleteTransaction(id: string): Observable<void> {
    return this.storageProvider.getStrategy().deleteTransaction(id);
  }

  getTransactionsByDateRange(userId: string, startDate: Date, endDate: Date): Observable<Transaction[]> {
    return this.getTransactions(userId, { startDate, endDate });
  }

  getTransactionsByType(userId: string, type: 'income' | 'expense' | 'saving', startDate?: Date, endDate?: Date): Observable<Transaction[]> {
    return this.getTransactions(userId, { type, startDate, endDate });
  }
}
