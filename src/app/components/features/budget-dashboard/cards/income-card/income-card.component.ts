import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DashboardStateService, DashboardSummary } from '../../../../../shared/services/dashboard-state.service';
import { AuthenticationService } from '../../../../../shared/services/authentication.service';
import { CurrencyFormattingService } from '../../../../../shared/services/currency-formatting.service';

@Component({
  selector: 'app-income-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="summary-card income-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon class="card-icon">trending_up</mat-icon>
          Income
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="card-body" *ngIf="!isLoading">
          <div class="amount" *ngIf="totalIncome !== null">
            {{ formatAmount(totalIncome) }}
          </div>
        </div>
        <div class="loading-skeleton" *ngIf="isLoading">
          <div class="skeleton-amount"></div>
          <div class="skeleton-trend"></div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .summary-card {
      height: 100%;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .summary-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    mat-card-header {
      margin-bottom: 1rem;
    }
    
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      font-weight: 500;
      color: #666;
    }
    
    .card-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: #4caf50;
    }
    
    .card-body {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .amount {
      font-size: 2rem;
      font-weight: bold;
      color: #4caf50;
      margin-top: 0.5rem;
    }
    
    .trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .trend.positive {
      color: #4caf50;
    }
    
    .trend.negative {
      color: #f44336;
    }
    
    .trend mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }
    
    .loading-skeleton {
      padding: 1rem 0;
    }
    
    .skeleton-amount {
      height: 2rem;
      width: 60%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
      margin-bottom: 0.75rem;
    }
    
    .skeleton-trend {
      height: 1rem;
      width: 40%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
    }
    
    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `]
})
export class IncomeCardComponent implements OnInit {
  totalIncome: number | null = null;
  isLoading = false;

  constructor(
    private dashboardState: DashboardStateService,
    private authService: AuthenticationService,
    private currencyService: CurrencyFormattingService
  ) {}

  ngOnInit(): void {
    this.dashboardState.getSummary().subscribe((summary: DashboardSummary) => {
      this.totalIncome = summary.totalIncome;
    });

    this.dashboardState.isLoading$.subscribe((loading: boolean) => {
      this.isLoading = loading;
    });
  }

  formatAmount(amount: number): string {
    const user = this.authService.getCurrentUser();
    return this.currencyService.formatAmount(amount, user?.currency || 'COP');
  }
}
