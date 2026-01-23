import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../enviroments/environment';
import { UserProfile } from './models/user-profile.model';
import { Genre } from './models/genre.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly API = environment.backendUrl;

  private http = inject(HttpClient);

  async getProfile(): Promise<UserProfile> {
    const url = `${this.API}/user/profile`;
    return firstValueFrom(this.http.get<UserProfile>(url));
  }


  async getGenres(): Promise<Genre[]> {
    const url = `${this.API}/genres`;
    return firstValueFrom(this.http.get<Genre[]>(url));
  }


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
