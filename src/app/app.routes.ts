import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../app/components/home/home.module').then((m) => m.HomeModule),
  },
];
