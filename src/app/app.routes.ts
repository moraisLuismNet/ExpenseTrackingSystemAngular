import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),
    title: 'Sign In'
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent),
    title: 'Create Account'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    title: 'Dashboard'
  },
  {
    path: 'expenses',
    loadComponent: () => import('./features/expenses/expenses-list/expenses-list').then(m => m.ExpensesListComponent),
    canActivate: [authGuard],
    title: 'Expenses'
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/categories-list/categories-list').then(m => m.CategoriesListComponent),
    canActivate: [authGuard],
    title: 'Categories'
  },
  {
    path: 'budgets',
    loadComponent: () => import('./features/budgets/budgets-list/budgets-list').then(m => m.BudgetsListComponent),
    canActivate: [authGuard],
    title: 'Budgets'
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
