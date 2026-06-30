import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { DateRangeService, RangeType, DateRange } from '../../../../shared/services/date-range.service';
import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { StorageProviderService } from '../../../../shared/services/storage-provider.service';
import { User } from '../../../../shared/models/budget.models';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatDatepickerModule, MatInputModule],
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent implements OnInit {
  currentRange$: Observable<DateRange>;
  currentUser: User | null = null;
  isDemoMode = false;

  rangeTypes: { value: RangeType; label: string }[] = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' }
  ];

  constructor(
    private dateRangeService: DateRangeService,
    private authService: AuthenticationService,
    private storageProvider: StorageProviderService,
    private router: Router
  ) {
    this.currentRange$ = this.dateRangeService.currentRange$;
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isDemoMode = this.storageProvider.getMode() === 'demo';
  }

  onRangeTypeChange(rangeType: RangeType): void {
    this.dateRangeService.setRangeType(rangeType);
  }

  onDateChange(date: Date): void {
    this.dateRangeService.setReferenceDate(date);
  }

  navigatePrevious(): void {
    this.dateRangeService.navigatePrevious();
  }

  navigateNext(): void {
    this.dateRangeService.navigateNext();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/budget-dashboard/mode-selection']);
  }

  formatDateRange(range: DateRange): string {
    switch (range.rangeType) {
      case 'week':
        return `${this.formatDate(range.startDate)} - ${this.formatDate(range.endDate)}`;
      case 'month':
        return range.referenceDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'year':
        return range.referenceDate.getFullYear().toString();
    }
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
