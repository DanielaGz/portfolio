import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from '../dashboard-header/dashboard-header.component';
import { IncomeCardComponent } from '../cards/income-card/income-card.component';
import { SavingsCardComponent } from '../cards/savings-card/savings-card.component';
import { ExpenseChartCardComponent } from '../cards/expense-chart-card/expense-chart-card.component';
import { ExpenseListCardComponent } from '../cards/expense-list-card/expense-list-card.component';
import { DashboardStateService } from '../../../../shared/services/dashboard-state.service';
import { AuthenticationService } from '../../../../shared/services/authentication.service';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [CommonModule, DashboardHeaderComponent, IncomeCardComponent, SavingsCardComponent, ExpenseChartCardComponent, ExpenseListCardComponent],
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss']
})
export class DashboardContainerComponent implements OnInit {
  constructor(
    private dashboardState: DashboardStateService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    // Ensure demo user is loaded
    this.authService.getCurrentUser();
    // Load dashboard data
    this.dashboardState.refreshData();
  }
}
