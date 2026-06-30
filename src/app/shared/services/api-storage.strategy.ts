import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StorageStrategy, TransactionFilters, CategoryFilters } from './storage-strategy.interface';
import { User, Transaction, Category } from '../models/budget.models';

@Injectable({
  providedIn: 'root'
})
export class ApiStorageStrategy implements StorageStrategy {
  private apiUrl = environment.apiHost;

  constructor(private http: HttpClient) {}

  authenticateUser(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/`, { email, password })
      .pipe(
        catchError(this.handleError)
      );
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTransactions(userId: string, filters?: TransactionFilters): Observable<Transaction[]> {
    let params = new HttpParams().set('user_id', userId);
    
    if (filters?.type) {
      params = params.set('type', filters.type);
    }
    
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions/`, { params })
      .pipe(
        map(transactions => {
          // Client-side date filtering
          if (filters?.startDate || filters?.endDate) {
            return transactions.filter(t => {
              const txDate = new Date(t.date);
              if (filters.startDate && txDate < filters.startDate) return false;
              if (filters.endDate && txDate > filters.endDate) return false;
              return true;
            });
          }
          return transactions;
        }),
        catchError(this.handleError)
      );
  }

  getTransaction(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/transactions/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/transactions/`, transaction)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateTransaction(id: string, transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/transactions/${id}`, transaction)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteTransaction(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/transactions/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCategories(filters?: CategoryFilters): Observable<Category[]> {
    let params = new HttpParams();
    
    if (filters?.type) {
      params = params.set('type', filters.type);
    }
    if (filters?.group) {
      params = params.set('group', filters.group);
    }
    
    return this.http.get<Category[]>(`${this.apiUrl}/categories/`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCategory(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createCategory(category: Omit<Category, 'id'>): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories/`, category)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
          break;
        case 400:
          errorMessage = 'Invalid request. Please check your input.';
          break;
        case 401:
        case 403:
          errorMessage = 'Authentication failed. Please check your credentials.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Error: ${error.message}`;
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
