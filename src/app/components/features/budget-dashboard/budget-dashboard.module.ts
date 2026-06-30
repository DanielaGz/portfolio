import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

import { AuthModeSelectionComponent } from './auth-mode-selection/auth-mode-selection.component';
import { LoginComponent } from './login/login.component';
import { DashboardContainerComponent } from './dashboard-container/dashboard-container.component';
import { authGuard } from '../../../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'mode-selection',
    component: AuthModeSelectionComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: DashboardContainerComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatIconModule,
    AuthModeSelectionComponent,
    LoginComponent,
    DashboardContainerComponent
  ]
})
export class BudgetDashboardModule { }
