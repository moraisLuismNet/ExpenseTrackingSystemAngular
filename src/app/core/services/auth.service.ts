import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import {
  ApiResponse, AuthResponseDto, RegisterDto, LoginDto,
  ChangePasswordDto, UserInfoDto
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';

  login(dto: LoginDto): Observable<ApiResponse<AuthResponseDto>> {
    return this.http.post<ApiResponse<AuthResponseDto>>(`${this.apiUrl}/login`, dto);
  }

  register(dto: RegisterDto): Observable<ApiResponse<AuthResponseDto>> {
    return this.http.post<ApiResponse<AuthResponseDto>>(`${this.apiUrl}/register`, dto);
  }

  changePassword(dto: ChangePasswordDto): Observable<ApiResponse<object>> {
    return this.http.put<ApiResponse<object>>(`${this.apiUrl}/change-password`, dto);
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  setUser(user: UserInfoDto): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  getUser(): UserInfoDto | null {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(this.userKey);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
