import { Injectable, InjectionToken } from '@angular/core';
import { StorageStrategy } from './storage-strategy.interface';
import { ApiStorageStrategy } from './api-storage.strategy';
import { LocalStorageStrategy } from './local-storage.strategy';

export const STORAGE_STRATEGY = new InjectionToken<StorageStrategy>('StorageStrategy');

export type StorageMode = 'demo' | 'api';

@Injectable({
  providedIn: 'root'
})
export class StorageProviderService {
  private currentMode: StorageMode = 'demo';
  private readonly MODE_KEY = 'storage_mode';

  constructor(
    private apiStrategy: ApiStorageStrategy,
    private localStrategy: LocalStorageStrategy
  ) {
    // Load saved mode from localStorage
    const savedMode = localStorage.getItem(this.MODE_KEY) as StorageMode;
    if (savedMode) {
      this.currentMode = savedMode;
    }
  }

  setMode(mode: StorageMode): void {
    this.currentMode = mode;
    localStorage.setItem(this.MODE_KEY, mode);
  }

  getMode(): StorageMode {
    return this.currentMode;
  }

  getStrategy(): StorageStrategy {
    return this.currentMode === 'api' ? this.apiStrategy : this.localStrategy;
  }

  clearSession(): void {
    localStorage.removeItem(this.MODE_KEY);
    localStorage.removeItem('current_user_id');
    this.currentMode = 'demo';
  }
}
