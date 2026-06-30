import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DashboardStateService } from '../../../../../shared/services/dashboard-state.service';
import { CategoriesService } from '../../../../../shared/services/categories.service';
import { CurrencyFormattingService } from '../../../../../shared/services/currency-formatting.service';
import { AuthenticationService } from '../../../../../shared/services/authentication.service';
import { Transaction, Category } from '../../../../../shared/models/budget.models';
import { TransactionModalComponent, TransactionModalData } from '../../modals/transaction-modal/transaction-modal.component';
import { Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

interface TransactionDisplay extends Transaction {
  categoryName: string;
  categoryIcon: string;
  formattedAmount: string;
  formattedDate: string;
}

@Component({
  selector: 'app-expense-list-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatListModule, MatDialogModule],
  template: `
    <mat-card class="expense-list-card">
      <mat-card-header>
        <mat-card-title>{{ title }}</mat-card-title>
        <button mat-icon-button class="add-button" (click)="onAddTransaction()" [disabled]="isLoading">
          <mat-icon>add</mat-icon>
        </button>
      </mat-card-header>
      <mat-card-content>
        <mat-list *ngIf="transactions.length > 0 && !isLoading" class="transaction-list">
          <mat-list-item *ngFor="let transaction of transactions" class="transaction-item">
            <div class="transaction-content">
              <div class="transaction-main">
                <span class="category-icon">{{ transaction.categoryIcon }}</span>
                <div class="transaction-info">
                  <div class="category-name">{{ transaction.categoryName }}</div>
                  <div class="transaction-description" *ngIf="transaction.description">
                    {{ transaction.description }}
                  </div>
                  <div class="transaction-date">{{ transaction.formattedDate }}</div>
                </div>
              </div>
              <div class="transaction-actions">
                <span class="transaction-amount">{{ transaction.formattedAmount }}</span>
                <button mat-icon-button class="edit-button" (click)="onEditTransaction(transaction)" [disabled]="isLoading">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button class="delete-button" (click)="onDeleteTransaction(transaction)" [disabled]="isLoading">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </mat-list-item>
        </mat-list>
        
        <div class="empty-state" *ngIf="transactions.length === 0 && !isLoading">
          <mat-icon class="empty-icon">receipt_long</mat-icon>
          <p>No transactions yet</p>
          <p class="hint">Click the + button to add your first {{ group }} expense</p>
        </div>
        
        <div class="loading" *ngIf="isLoading">
          <p>Loading transactions...</p>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .expense-list-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .add-button {
      margin-left: auto;
    }
    
    mat-card-content {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }
    
    .transaction-list {
      padding: 0;
    }
    
    .transaction-item {
      border-bottom: 1px solid #e0e0e0;
      height: auto !important;
      padding: 1rem;
    }
    
    .transaction-item:last-child {
      border-bottom: none;
    }
    
    .transaction-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    
    .transaction-main {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
    }
    
    .category-icon {
      font-size: 1.5rem;
    }
    
    .transaction-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    }
    
    .category-name {
      font-weight: 500;
      font-size: 0.875rem;
    }
    
    .transaction-description {
      font-size: 0.75rem;
      color: #666;
    }
    
    .transaction-date {
      font-size: 0.75rem;
      color: #999;
    }
    
    .transaction-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .transaction-amount {
      font-weight: 600;
      color: #f44336;
      white-space: nowrap;
    }
    
    .edit-button {
      opacity: 0.6;
    }
    
    .edit-button:hover {
      opacity: 1;
      color: #2196f3;
    }
    
    .delete-button {
      opacity: 0.6;
    }
    
    .delete-button:hover {
      opacity: 1;
      color: #f44336;
    }
    
    .empty-state {
      text-align: center;
      color: #999;
      padding: 3rem 2rem;
    }
    
    .empty-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      opacity: 0.3;
      margin-bottom: 1rem;
    }
    
    .empty-state p {
      margin: 0.5rem 0;
    }
    
    .empty-state .hint {
      font-size: 0.875rem;
    }
    
    .loading {
      text-align: center;
      color: #999;
      padding: 2rem;
    }
  `]
})
export class ExpenseListCardComponent implements OnInit, OnDestroy {
  @Input() group: 'needs' | 'wants' = 'needs';
  
  title = '';
  transactions: TransactionDisplay[] = [];
  isLoading = false;
  private subscription?: Subscription;

  constructor(
    private dashboardState: DashboardStateService,
    private categoriesService: CategoriesService,
    private currencyService: CurrencyFormattingService,
    private authService: AuthenticationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.title = this.group === 'needs' ? 'Needs Transactions' : 'Wants Transactions';
    this.loadTransactions();
    
    this.dashboardState.isLoading$.subscribe((loading: boolean) => {
      this.isLoading = loading;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private loadTransactions(): void {
    this.subscription = combineLatest([
      this.dashboardState.transactions$,
      this.dashboardState.categories$
    ]).pipe(
      map(([transactions, categories]) => {
        const user = this.authService.getCurrentUser();
        const currency = user?.currency || 'COP';
        
        return transactions
          .filter(t => t.type === 'expense')
          .filter(t => this.getCategoryGroup(t.category, categories) === this.group)
          .map(t => this.mapTransactionToDisplay(t, categories, currency))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      })
    ).subscribe((transactions: TransactionDisplay[]) => {
      this.transactions = transactions;
    });
  }

  private getCategoryGroup(categoryId: string, categories: Category[]): 'needs' | 'wants' | 'savings' | null {
    const category = categories.find(c => c.id === categoryId || c.name === categoryId);
    return category?.group || null;
  }

  private mapTransactionToDisplay(
    transaction: Transaction,
    categories: Category[],
    currency: string
  ): TransactionDisplay {
    const category = categories.find(c => c.id === transaction.category || c.name === transaction.category);
    
    return {
      ...transaction,
      categoryName: category?.name || transaction.category,
      categoryIcon: category?.icon || '💰',
      formattedAmount: this.currencyService.formatAmount(transaction.amount, currency),
      formattedDate: this.formatDate(transaction.date)
    };
  }

  private formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (d.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  onAddTransaction(): void {
    const dialogData: TransactionModalData = {
      preselectedType: 'expense',
      preselectedGroup: this.group
    };

    const dialogRef = this.dialog.open(TransactionModalComponent, {
      width: '500px',
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.action === 'created') {
        console.log('Transaction created:', result.transaction);
      }
    });
  }

  onEditTransaction(transaction: Transaction): void {
    const dialogData: TransactionModalData = {
      transaction: transaction
    };

    const dialogRef = this.dialog.open(TransactionModalComponent, {
      width: '500px',
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.action === 'updated') {
        console.log('Transaction updated:', result.transaction);
      } else if (result && result.action === 'deleted') {
        console.log('Transaction deleted from modal');
      }
    });
  }

  onDeleteTransaction(transaction: Transaction): void {
    const confirmed = confirm(`Delete transaction for ${transaction.category}?`);
    if (!confirmed) return;

    this.dashboardState.deleteTransaction(transaction.id!).subscribe({
      next: () => {
        console.log('Transaction deleted successfully');
      },
      error: (error: any) => {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction. Please try again.');
      }
    });
  }
}
