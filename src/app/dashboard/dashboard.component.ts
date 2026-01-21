import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarDashboardComponent } from './navbar-dashboard/navbar-dashboard.component';
import { ToastComponent } from "./profile/ui/toast.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarDashboardComponent,
    ToastComponent
],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {}
