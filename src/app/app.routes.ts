import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../app/components/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'features',
    loadChildren: () =>
      import('../app/components/features/features.module').then((m) => m.FeaturesModule),
  },
  {
    path: 'budget-dashboard',
    loadChildren: () =>
      import('../app/components/features/budget-dashboard/budget-dashboard.module').then((m) => m.BudgetDashboardModule),
  },
  { path: '**', redirectTo: '' }
];
