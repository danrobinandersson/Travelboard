import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home-page/home-page').then((m) => m.HomePage),
  },
  {
    path: 'country/:code',
    loadComponent: () => import('./pages/country-page/country-page').then((m) => m.CountryPage),
  },
  { path: '**', redirectTo: '' },
];
