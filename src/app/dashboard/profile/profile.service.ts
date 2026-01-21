import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../enviroments/environment';
import { UserProfile } from './models/user-profile.model';
import { Genre } from './models/genre.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly API = environment.backendUrl;

  // Usamos inject() para seguir el estilo moderno de Angular
  private http = inject(HttpClient);

  /**
   * Obtiene el perfil del usuario.
   * El interceptor añadirá el Header Authorization automáticamente.
   */
  async getProfile(): Promise<UserProfile> {
    const url = `${this.API}/user/profile`;
    // firstValueFrom convierte el Observable de HttpClient en una Promesa
    return firstValueFrom(this.http.get<UserProfile>(url));
  }

  /**
   * Obtiene la lista de géneros disponibles.
   */
  async getGenres(): Promise<Genre[]> {
    const url = `${this.API}/genres`;
    return firstValueFrom(this.http.get<Genre[]>(url));
  }

  /**
   * Actualiza los géneros preferidos del usuario.
   */
  async updatePreferences(genreIds: number[]): Promise<any> {
    const url = `${this.API}/user/preferences/genres`;
    return firstValueFrom(
      this.http.post(url, { genres: genreIds })
    );
  }

async updatePassword(data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) {
    return firstValueFrom(
      this.http.post(`${this.API}/user/password`, data)
    );
  }

}
