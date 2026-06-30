import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageProviderService } from './storage-provider.service';
import { User } from '../models/budget.models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private storageProvider: StorageProviderService) {}

  authenticateUser(email: string, password: string): Observable<User> {
    return this.storageProvider.getStrategy().authenticateUser(email, password);
  }

  getUser(id: string): Observable<User> {
    return this.storageProvider.getStrategy().getUser(id);
  }
}
