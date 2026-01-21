import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../enviroments/environment';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private http = inject(HttpClient);
  private API = environment.backendUrl;

  changePassword(data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) {
    return firstValueFrom(
      this.http.post(`${this.API}/user/password`, data)
    );
  }
}
