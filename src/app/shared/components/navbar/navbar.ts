import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <div class="flex items-center gap-8">
            <a routerLink="/" class="flex items-center gap-2.5">
              <img src="assets/ExpenseTrackingSystem.png" alt="ExpenseTracker" class="w-16 h-16 object-contain" />
              <span class="text-xl font-bold text-gray-900">ExpenseTracker</span>
            </a>
            @if (auth.isAuthenticated()) {
              <div class="hidden sm:flex space-x-4">
                @if (router.url === '/dashboard') {
                  <span class="text-gray-600 px-3 py-2 text-sm">Dashboard</span>
                } @else {
                  <a routerLink="/dashboard" class="text-gray-600 hover:text-brand px-3 py-2 text-sm">Dashboard</a>
                }
                @if (router.url === '/expenses') {
                  <span class="text-gray-600 px-3 py-2 text-sm">Expenses</span>
                } @else {
                  <a routerLink="/expenses" class="text-gray-600 hover:text-brand px-3 py-2 text-sm">Expenses</a>
                }
                @if (router.url === '/categories') {
                  <span class="text-gray-600 px-3 py-2 text-sm">Categories</span>
                } @else {
                  <a routerLink="/categories" class="text-gray-600 hover:text-brand px-3 py-2 text-sm">Categories</a>
                }
                @if (router.url === '/budgets') {
                  <span class="text-gray-600 px-3 py-2 text-sm">Budgets</span>
                } @else {
                  <a routerLink="/budgets" class="text-gray-600 hover:text-brand px-3 py-2 text-sm">Budgets</a>
                }
              </div>
            }
          </div>
          <div class="flex items-center space-x-4">
            @if (auth.isAuthenticated()) {
              <span class="text-sm text-gray-500">{{ auth.getUser()?.email }}</span>
              <button (click)="logout()" class="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Logout</button>
            } @else {
              @if (router.url === '/login') {
                <span class="text-sm text-gray-600">Sign In</span>
                <a routerLink="/register" class="text-sm bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark">Register</a>
              } @else if (router.url === '/register') {
                <span class="text-sm text-gray-600">Register</span>
                <a routerLink="/login" class="text-sm bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark">Sign In</a>
              } @else {
                <a routerLink="/login" class="text-sm text-gray-600 hover:text-brand">Sign In</a>
                <a routerLink="/register" class="text-sm bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark">Register</a>
              }
            }
          </div>
        </div>
      </div>
    </nav>
  `,
  standalone: true,
  imports: [RouterLink]
})
export class NavbarComponent {
  auth = inject(AuthService);
  router = inject(Router);

  logout(): void {
    this.auth.logout();
    window.location.href = '/login';
  }
}
