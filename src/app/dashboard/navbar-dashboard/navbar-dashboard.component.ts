import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { LogoutIconComponent } from './icons/logout-icon.component';

@Component({
  selector: 'app-navbar-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LogoutIconComponent
  ],
  templateUrl: './navbar-dashboard.component.html'
})
export class NavbarDashboardComponent {

  isProfileOpen = false;
  isLoggingOut = false; // 🔒 bloqueo

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleProfile() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  goToProfile() {
    this.isProfileOpen = false;
    this.router.navigate(['/dashboard/profile']);
  }

  async logout() {
    if (this.isLoggingOut) return;

    this.isLoggingOut = true;
    await this.authService.logout();
    this.isLoggingOut = false;
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-dropdown')) {
      this.isProfileOpen = false;
    }
  }
}
