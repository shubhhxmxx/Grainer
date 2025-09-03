import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home.component/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./features/auth/signin/signin.component').then(m => m.SigninComponent)
  },
  {
    path: 'subscribe',
    loadComponent: () =>
      import('./features/subscribe/subscribe.component').then(m => m.SubscribeComponent)
  },
  {
    path: 'upload',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dataset/upload/upload.component').then(m => m.UploadComponent)
  },
  {
    path: 'preferences',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/settings/preferences/preferences.component').then(m => m.PreferencesComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dataset/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { path: '**', redirectTo: '' }
];
