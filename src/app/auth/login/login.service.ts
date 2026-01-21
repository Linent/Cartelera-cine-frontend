import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/environment';
import { Observable } from 'rxjs';

const API_URL = environment.backendUrl;

@Injectable({ providedIn: 'root' })
export class LoginService {

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${API_URL}/login`, {
      username,
      password
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${API_URL}/logout`, {});
  }

  me(): Observable<any> {
    return this.http.get(`${API_URL}/me`);
  }
}
