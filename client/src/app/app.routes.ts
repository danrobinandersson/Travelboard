import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home-page/home-page').then((m) => m.HomePage),
  },
  {
    path: 'country/:code',
    loadComponent: () => import('./pages/country-page/country-page').then((m) => m.CountryPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'favourites',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/favourites-page/favourites-page').then((m) => m.FavouritesPage),
  },
  { path: '**', redirectTo: '' },
];
