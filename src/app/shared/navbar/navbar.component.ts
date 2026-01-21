import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginIconComponent } from './icons/loginIcon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LoginIconComponent],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  @Output() loginClick = new EventEmitter<void>();

  openLogin() {
    this.loginClick.emit();
  }
}
