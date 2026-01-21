import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home';
import { ProfileComponent } from './dashboard/profile/profile.component';

import { authGuard } from './auth/auth-guard';
import { publicGuard } from './auth/public.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [publicGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardHomeComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      }
    ]
  },
  {
    path: '**', 
    redirectTo: ''
  }
];
