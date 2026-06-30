import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StorageProviderService } from '../../../../shared/services/storage-provider.service';

@Component({
  selector: 'app-auth-mode-selection',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './auth-mode-selection.component.html',
  styleUrls: ['./auth-mode-selection.component.scss']
})
export class AuthModeSelectionComponent {
  constructor(
    private storageProvider: StorageProviderService,
    private router: Router
  ) {}

  selectDemoMode(): void {
    this.storageProvider.setMode('demo');
    this.router.navigate(['/budget-dashboard']);
  }

  selectLoginMode(): void {
    this.storageProvider.setMode('api');
    this.router.navigate(['/budget-dashboard/login']);
  }
}
