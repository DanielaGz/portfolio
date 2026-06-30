import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { StorageProviderService } from './storage-provider.service';
import { User } from '../models/budget.models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly USER_ID_KEY = 'current_user_id';
  private currentUser: User | null = null;

  constructor(private storageProvider: StorageProviderService) {
    this.loadCurrentUser();
  }

  login(email: string, password: string): Observable<User> {
    const strategy = this.storageProvider.getStrategy();
    
    return strategy.authenticateUser(email, password).pipe(
      tap(user => {
        this.currentUser = user;
        localStorage.setItem(this.USER_ID_KEY, user.id);
      })
    );
  }

  logout(): void {
    this.currentUser = null;
    this.storageProvider.clearSession();
  }

  getCurrentUser(): User | null {
    // In demo mode, load demo user if not already loaded
    if (!this.currentUser && this.storageProvider.getMode() === 'demo') {
      const demoUserStr = localStorage.getItem('demo_user');
      if (demoUserStr) {
        this.currentUser = JSON.parse(demoUserStr);
      }
    }
    return this.currentUser;
  }

  getCurrentUserId(): string | null {
    const userId = localStorage.getItem(this.USER_ID_KEY);
    
    // In demo mode, return demo user ID if not logged in
    if (!userId && this.storageProvider.getMode() === 'demo') {
      const demoUserStr = localStorage.getItem('demo_user');
      if (demoUserStr) {
        const demoUser = JSON.parse(demoUserStr);
        return demoUser.id;
      }
    }
    
    return userId;
  }

  isAuthenticated(): boolean {
    const mode = this.storageProvider.getMode();
    
    // In demo mode, always authenticated
    if (mode === 'demo') {
      return true;
    }
    
    // In API mode, check if user ID exists
    return !!this.getCurrentUserId();
  }

  private loadCurrentUser(): void {
    const userId = this.getCurrentUserId();
    if (userId) {
      const strategy = this.storageProvider.getStrategy();
      strategy.getUser(userId).subscribe({
        next: (user) => {
          this.currentUser = user;
        },
        error: () => {
          // Clear invalid session
          localStorage.removeItem(this.USER_ID_KEY);
        }
      });
    }
  }
}
