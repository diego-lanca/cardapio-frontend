import { HttpClient } from '@angular/common/http';
import { computed, inject, Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from './storage-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  
  private userSignal = signal<User | null>(null);
  private apiUrl = environment.apiUrl;

  user = this.userSignal.asReadonly();
  
  isAuthenticated = computed(() => !!this.storageService.authToken());
  isAdmin = computed(() => this.user()?.isAdmin);

  constructor() {
    // Carrega o usuário se houver token
    const token = this.storageService.authToken();
    if (token) {
      this.loadUser();
    }
  }

  login(username: string, password: string) {
    return this.http
      .post<{
        access_token: string;
        token_type: string;
      }>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap((response) => {
          this.storageService.setAuthToken(response.access_token);
          this.loadUser();
        }),
        catchError((error) => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  logout() {
    this.storageService.setAuthToken(null);
    this.userSignal.set(null);
    this.storageService.setCart([]);
  }

  register(userData: { email: string, username: string; full_name: string; password: string; is_admin: boolean }) {
    return this.http
      .post<User>(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        tap(() => {
          this.login(userData.username, userData.password).subscribe();
        })
      );
  }

  private loadUser() {
    this.http.get<User>(`${this.apiUrl}/auth/me`).subscribe({
      next: (user) => {
        this.userSignal.set(user);
      },
      error: (err) => {
        console.error('Error loading user:', err);
        
        if (err.status === 401) {
          this.logout();
        }
      },
    });
  }

  // Verificar se o token ainda é válido
  validateToken() {
    return this.http.get<any>(`${this.apiUrl}/auth/verify-token`).pipe(
      tap((response) => {
        if (!response.is_active) {
          this.logout();
        }
      }),
      catchError(() => {
        this.logout();
        return of({ valid: false });
      })
    );
  }
}
