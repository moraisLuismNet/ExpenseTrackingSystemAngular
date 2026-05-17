import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button';

@Component({
  selector: 'app-register',
  template: `
    <div class="min-h-[80vh] flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-10">
          <img src="assets/ExpenseTrackingSystem.png" alt="ExpenseTracker" class="w-32 h-32 mx-auto object-contain mb-6" />
          <h1 class="text-3xl font-bold text-gray-900">Create Account</h1>
          <p class="text-gray-500 mt-1">Get started with ExpenseTracker</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          @if (error()) {
            <div class="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{{ error() }}</div>
          }
          @if (success()) {
            <div class="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">{{ success() }}</div>
          }
          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" [(ngModel)]="firstName" name="firstName" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" [(ngModel)]="lastName" name="lastName" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"/>
              </div>
            </div>
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
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"/>
            </div>
            <div class="pt-6">
              <app-button [loading]="loading()">Register</app-button>
            </div>
          </form>
          <p class="text-sm text-gray-500 text-center mt-6">
            Already have an account? <a routerLink="/login" class="text-brand hover:underline">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonComponent]
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);
  error = signal('');
  success = signal('');

  constructor() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.firstName || !this.lastName || !this.email || !this.password) return;
    if (this.password !== this.confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    this.auth.register({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.success.set('Registration successful! Redirecting to login...');
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.error.set(res.message || 'Registration failed');
        }
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.message || 'Registration failed. Please try again.');
        this.loading.set(false);
      }
    });
  }
}
