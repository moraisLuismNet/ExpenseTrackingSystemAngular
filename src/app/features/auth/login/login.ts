import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button';

@Component({
  selector: 'app-login',
  template: `
    <div class="min-h-[80vh] flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-10">
          <img src="assets/ExpenseTrackingSystem.png" alt="ExpenseTracker" class="w-32 h-32 mx-auto object-contain mb-6" />
          <h1 class="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p class="text-gray-500 mt-1">Sign in to your ExpenseTracker account</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          @if (error()) {
            <div class="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{{ error() }}</div>
          }
          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" [(ngModel)]="email" name="email" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" [(ngModel)]="password" name="password" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"/>
            </div>
            <div class="pt-6">
              <app-button [loading]="loading()">Sign In</app-button>
            </div>
          </form>
          <p class="text-sm text-gray-500 text-center mt-6">
            Don't have an account? <a routerLink="/register" class="text-brand hover:underline">Register</a>
          </p>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonComponent]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) return;
    this.loading.set(true);
    this.error.set('');

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.auth.setToken(res.data.token);
          this.auth.setUser(res.data.user);
          this.router.navigate(['/dashboard']);
        } else {
          this.error.set(res.message || 'Login failed');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Invalid email or password');
        this.loading.set(false);
      }
    });
  }
}
