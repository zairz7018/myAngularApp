import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginPayload } from '../../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'sm_token';

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(tap((res) => localStorage.setItem(this.tokenKey, res.token)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(this.tokenKey));
  }

  token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  currentUserEmail(): Observable<string> {
    return this.http.get<{ email: string }>(`${environment.apiUrl}/profile`).pipe(map(r => r.email));
  }
}
