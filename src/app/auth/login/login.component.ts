import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  nickname = '';
  password = '';
  error = '';
  isLoading = false;

  @Output() loginSuccess = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  async login() {
    this.error = '';
    this.isLoading = true;

    const success = await this.authService.login(
      this.nickname,
      this.password
    );

    if (success) {
      this.loginSuccess.emit();  
    } else {
      this.error = 'Credenciales inválidas';
    }

    this.isLoading = false;
  }
}
