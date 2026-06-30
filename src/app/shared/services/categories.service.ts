import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageProviderService } from './storage-provider.service';
import { Category } from '../models/budget.models';
import { CategoryFilters } from './storage-strategy.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private storageProvider: StorageProviderService) {}

  getCategories(filters?: CategoryFilters): Observable<Category[]> {
    return this.storageProvider.getStrategy().getCategories(filters);
  }

  getCategory(id: string): Observable<Category> {
    return this.storageProvider.getStrategy().getCategory(id);
  }

  createCategory(category: Omit<Category, 'id'>): Observable<Category> {
    return this.storageProvider.getStrategy().createCategory(category);
  }

  getCategoriesByType(type: 'income' | 'expense' | 'saving'): Observable<Category[]> {
    return this.getCategories({ type });
  }

  getCategoriesByGroup(group: 'needs' | 'wants' | 'savings'): Observable<Category[]> {
    return this.getCategories({ group });
  }

  getCategoriesByTypeAndGroup(type: 'income' | 'expense' | 'saving', group: 'needs' | 'wants' | 'savings'): Observable<Category[]> {
    return this.getCategories({ type, group });
  }
}
