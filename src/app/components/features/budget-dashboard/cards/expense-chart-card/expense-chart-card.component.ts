import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DashboardStateService, ExpenseByCategory } from '../../../../../shared/services/dashboard-state.service';
import { CurrencyFormattingService } from '../../../../../shared/services/currency-formatting.service';
import { AuthenticationService } from '../../../../../shared/services/authentication.service';
import { ChartThemeService } from '../../../../../shared/services/chart-theme.service';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-expense-chart-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="expense-chart-card">
      <mat-card-header>
        <mat-card-title>{{ title }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="chart-container" *ngIf="hasData && !isLoading">
          <canvas #chartCanvas></canvas>
        </div>
        <div class="empty-state" *ngIf="!hasData && !isLoading">
          <p>No expenses yet</p>
          <p class="hint">Add transactions to see your spending breakdown</p>
        </div>
        <div class="loading" *ngIf="isLoading">
          <p>Loading chart...</p>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .expense-chart-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    mat-card-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .chart-container {
      width: 100%;
      max-width: 400px;
      position: relative;
    }
    
    .empty-state {
      text-align: center;
      color: #999;
      padding: 2rem;
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
export class ExpenseChartCardComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() group: 'needs' | 'wants' = 'needs';
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;
  
  title = '';
  hasData = false;
  isLoading = false;
  private chart?: Chart;
  private dataSubscription?: Subscription;
  private themeSubscription?: Subscription;
  private currentExpenses: ExpenseByCategory[] = [];

  constructor(
    private dashboardState: DashboardStateService,
    private currencyService: CurrencyFormattingService,
    private authService: AuthenticationService,
    private chartThemeService: ChartThemeService
  ) {}

  ngOnInit(): void {
    this.title = this.group === 'needs' ? 'Needs Expenses' : 'Wants Expenses';
    
    this.dashboardState.isLoading$.subscribe((loading: boolean) => {
      this.isLoading = loading;
    });

    this.themeSubscription = this.chartThemeService.colorPalette$.subscribe(() => {
      if (this.hasData && this.currentExpenses.length > 0) {
        this.updateChart(this.currentExpenses);
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadChartData();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  private loadChartData(): void {
    this.dataSubscription = this.dashboardState.getExpensesByCategory(this.group).subscribe(
      (expenses: ExpenseByCategory[]) => {
        this.currentExpenses = expenses;
        this.hasData = expenses.length > 0;
        
        if (this.hasData && this.chartCanvas) {
          this.updateChart(expenses);
        } else if (this.chart) {
          this.chart.destroy();
          this.chart = undefined;
        }
      }
    );
  }

  private updateChart(expenses: ExpenseByCategory[]): void {
    if (!this.chartCanvas) return;

    const colors = this.chartThemeService.getGroupColors(this.group);
    const themeColors = this.chartThemeService.getCurrentThemeColors();
    const user = this.authService.getCurrentUser();
    const currency = user?.currency || 'COP';

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: expenses.map((e: ExpenseByCategory) => `${e.categoryIcon} ${e.category}`),
        datasets: [{
          data: expenses.map((e: ExpenseByCategory) => e.amount),
          backgroundColor: colors.slice(0, expenses.length),
          borderWidth: 2,
          borderColor: themeColors.backgroundColor
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
          duration: 500,
          easing: 'easeInOutQuart'
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 12
              },
              color: themeColors.textColor
            }
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const expense = expenses[context.dataIndex];
                const amount = this.currencyService.formatAmount(expense.amount, currency);
                const percentage = expense.percentage.toFixed(1);
                return `${expense.category}: ${amount} (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    if (this.chart) {
      this.chart.data = config.data;
      if (this.chart.options.plugins?.legend?.labels) {
        this.chart.options.plugins.legend.labels.color = themeColors.textColor;
      }
      this.chart.update('active');
    } else {
      this.chart = new Chart(this.chartCanvas.nativeElement, config);
    }
  }
}
