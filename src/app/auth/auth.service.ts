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


  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ token: string }>(`${this.API}/login`, { username, password })
      );

      if (response && response.token) {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en el login:', error);
      return false;
    }
  }


  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${this.API}/logout`, {}));
    } catch (error) {
      console.error('Error en el logout:', error);
    } finally {
      localStorage.removeItem(this.TOKEN_KEY);
      this.router.navigate(['/']);
    }
  }


  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token;
  }


  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
