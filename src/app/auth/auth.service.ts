import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'token';
  private readonly API = environment.backendUrl;

  private http = inject(HttpClient);
  private router = inject(Router);

  // ========================
  // 🔐 LOGIN
  // ========================
  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ token: string }>(`${this.API}/login`, {
          username,
          password
        })
      );

      if (response?.token) {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  }

  // ========================
  // 🚪 LOGOUT (idempotente)
  // ========================
  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${this.API}/logout`, {})
      );
    } catch (error) {
      // ⚠️ Si falla backend NO bloqueamos el logout
      console.warn('Logout backend falló, cerrando sesión local');
    } finally {
      this.clearSession();
    }
  }

  // ========================
  // 🧹 LIMPIEZA LOCAL
  // ========================
  clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/']);
  }

  // ========================
  // 🔎 SESIÓN
  // ========================
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
