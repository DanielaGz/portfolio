import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { StorageProviderService } from '../services/storage-provider.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const storageProvider = inject(StorageProviderService);
  const router = inject(Router);

  const mode = storageProvider.getMode();
  
  // If in demo mode and on dashboard route, allow access
  if (mode === 'demo' && (state.url.includes('/budget-dashboard') && !state.url.includes('mode-selection') && !state.url.includes('login'))) {
    return true;
  }

  // If in API mode, check authentication
  if (mode === 'api' && authService.isAuthenticated()) {
    return true;
  }

  // If not authenticated or no mode selected, redirect to mode selection
  router.navigate(['/budget-dashboard/mode-selection']);
  return false;
};
