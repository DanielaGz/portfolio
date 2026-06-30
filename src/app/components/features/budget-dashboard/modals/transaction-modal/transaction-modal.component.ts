import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Transaction, Category } from '../../../../../shared/models/budget.models';
import { CategoriesService } from '../../../../../shared/services/categories.service';
import { DashboardStateService } from '../../../../../shared/services/dashboard-state.service';
import { AuthenticationService } from '../../../../../shared/services/authentication.service';

export interface TransactionModalData {
  transaction?: Transaction;
  preselectedType?: 'income' | 'expense' | 'saving';
  preselectedGroup?: 'needs' | 'wants' | 'savings';
}

@Component({
  selector: 'app-transaction-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>{{ isEditMode ? 'edit' : 'add' }}</mat-icon>
      {{ isEditMode ? 'Edit Transaction' : 'New Transaction' }}
    </h2>
    
    <mat-dialog-content>
      <form [formGroup]="transactionForm" class="transaction-form">
        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <mat-select formControlName="type" (selectionChange)="onTypeChange()">
            <mat-option value="income">Income</mat-option>
            <mat-option value="expense">Expense</mat-option>
            <mat-option value="saving">Saving</mat-option>
          </mat-select>
          <mat-error *ngIf="transactionForm.get('type')?.hasError('required')">
            Type is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" *ngIf="transactionForm.get('type')?.value === 'expense'">
          <mat-label>Group</mat-label>
          <mat-select formControlName="group" (selectionChange)="onGroupChange()">
            <mat-option value="needs">Needs</mat-option>
            <mat-option value="wants">Wants</mat-option>
          </mat-select>
          <mat-error *ngIf="transactionForm.get('group')?.hasError('required')">
            Group is required for expenses
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category">
            <mat-option *ngFor="let category of filteredCategories" [value]="category.id">
              {{ category.icon }} {{ category.name }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="transactionForm.get('category')?.hasError('required')">
            Category is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Amount</mat-label>
          <input matInput type="number" formControlName="amount" min="0" step="0.01">
          <span matPrefix>$ &nbsp;</span>
          <mat-error *ngIf="transactionForm.get('amount')?.hasError('required')">
            Amount is required
          </mat-error>
          <mat-error *ngIf="transactionForm.get('amount')?.hasError('min')">
            Amount must be greater than 0
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="transactionForm.get('date')?.hasError('required')">
            Date is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description (optional)</mat-label>
          <textarea matInput formControlName="description" rows="3" maxlength="200"></textarea>
          <mat-hint align="end">{{ transactionForm.get('description')?.value?.length || 0 }}/200</mat-hint>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()" [disabled]="isSaving">
        Cancel
      </button>
      <button mat-button color="warn" *ngIf="isEditMode" (click)="onDelete()" [disabled]="isSaving">
        <mat-icon>delete</mat-icon>
        Delete
      </button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!transactionForm.valid || isSaving">
        <mat-icon>{{ isSaving ? 'hourglass_empty' : 'save' }}</mat-icon>
        {{ isSaving ? 'Saving...' : 'Save' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
    }

    mat-dialog-content {
      min-width: 400px;
      max-width: 500px;
      padding: 1.5rem 0;
    }

    .transaction-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    mat-form-field {
      width: 100%;
    }

    mat-dialog-actions {
      padding: 1rem 0;
      gap: 0.5rem;
    }

    mat-dialog-actions button {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    mat-dialog-actions button mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }
  `]
})
export class TransactionModalComponent implements OnInit {
  transactionForm: FormGroup;
  isEditMode = false;
  isSaving = false;
  allCategories: Category[] = [];
  filteredCategories: Category[] = [];
  hasUnsavedChanges = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TransactionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionModalData,
    private categoriesService: CategoriesService,
    private dashboardState: DashboardStateService,
    private authService: AuthenticationService
  ) {
    this.isEditMode = !!data.transaction;

    this.transactionForm = this.fb.group({
      type: [data.preselectedType || data.transaction?.type || 'expense', Validators.required],
      group: [data.preselectedGroup || null],
      category: [data.transaction?.category || '', Validators.required],
      amount: [data.transaction?.amount || null, [Validators.required, Validators.min(0.01)]],
      date: [data.transaction?.date ? new Date(data.transaction.date) : new Date(), Validators.required],
      description: [data.transaction?.description || '']
    });

    // Track form changes
    this.transactionForm.valueChanges.subscribe(() => {
      this.hasUnsavedChanges = true;
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.updateGroupValidation();
    this.filterCategories();
  }

  private loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.allCategories = categories;
        this.filterCategories();
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onTypeChange(): void {
    this.updateGroupValidation();
    this.filterCategories();
    // Clear category when type changes
    this.transactionForm.patchValue({ category: '' });
  }

  onGroupChange(): void {
    this.filterCategories();
    // Clear category when group changes
    this.transactionForm.patchValue({ category: '' });
  }

  private updateGroupValidation(): void {
    const typeControl = this.transactionForm.get('type');
    const groupControl = this.transactionForm.get('group');

    if (typeControl?.value === 'expense') {
      groupControl?.setValidators(Validators.required);
    } else {
      groupControl?.clearValidators();
      groupControl?.setValue(null);
    }
    groupControl?.updateValueAndValidity();
  }

  private filterCategories(): void {
    const type = this.transactionForm.get('type')?.value;
    const group = this.transactionForm.get('group')?.value;

    if (type === 'income') {
      this.filteredCategories = this.allCategories.filter(c => c.type === 'income');
    } else if (type === 'expense' && group) {
      this.filteredCategories = this.allCategories.filter(
        c => c.type === 'expense' && c.group === group
      );
    } else if (type === 'saving') {
      this.filteredCategories = this.allCategories.filter(
        c => c.type === 'saving' || c.group === 'savings'
      );
    } else {
      this.filteredCategories = [];
    }
  }

  onSave(): void {
    if (this.transactionForm.invalid) return;

    this.isSaving = true;
    const formValue = this.transactionForm.value;
    const userId = this.authService.getCurrentUserId() || '';

    const transaction: Partial<Transaction> = {
      type: formValue.type,
      category: formValue.category,
      amount: formValue.amount,
      date: formValue.date instanceof Date ? formValue.date.toISOString() : formValue.date,
      description: formValue.description,
      user_id: userId
    };

    if (this.isEditMode && this.data.transaction) {
      transaction.id = this.data.transaction.id;
      this.dashboardState.updateTransaction(this.data.transaction.id!, transaction as Transaction).subscribe({
        next: () => {
          this.hasUnsavedChanges = false;
          this.dialogRef.close({ action: 'updated', transaction });
        },
        error: (error: any) => {
          console.error('Error updating transaction:', error);
          alert('Failed to update transaction. Please try again.');
          this.isSaving = false;
        }
      });
    } else {
      this.dashboardState.addTransaction(transaction as Transaction).subscribe({
        next: () => {
          this.hasUnsavedChanges = false;
          this.dialogRef.close({ action: 'created', transaction });
        },
        error: (error: any) => {
          console.error('Error creating transaction:', error);
          alert('Failed to create transaction. Please try again.');
          this.isSaving = false;
        }
      });
    }
  }

  onDelete(): void {
    if (!this.data.transaction) return;

    const confirmed = confirm('Are you sure you want to delete this transaction? This action cannot be undone.');
    if (!confirmed) return;

    this.isSaving = true;
    this.dashboardState.deleteTransaction(this.data.transaction.id!).subscribe({
      next: () => {
        this.hasUnsavedChanges = false;
        this.dialogRef.close({ action: 'deleted', transaction: this.data.transaction });
      },
      error: (error: any) => {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction. Please try again.');
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    if (this.hasUnsavedChanges) {
      const confirmed = confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmed) return;
    }
    this.dialogRef.close(null);
  }
}
