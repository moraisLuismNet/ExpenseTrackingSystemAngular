import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../../core/services/expense.service';
import { CategoryService } from '../../../core/services/category.service';
import { CardComponent } from '../../../shared/components/card/card';
import { ButtonComponent } from '../../../shared/components/button/button';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format';
import {
  ExpenseDto, CreateExpenseDto, UpdateExpenseDto, CategoryDto
} from '../../../core/models/api.models';

@Component({
  selector: 'app-expenses-list',
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Expenses</h1>
        <div class="flex items-center gap-3">
          @if (categories().length === 0) {
            <span class="text-sm text-gray-400">Create a category first</span>
          }
          <app-button [disabled]="categories().length === 0"
            (clicked)="showForm = true; editId = null; resetForm()">Add Expense</app-button>
        </div>
      </div>

      <app-card>
        @if (loading()) {
          <app-loading-spinner />
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                  <th class="text-right py-3 px-4 font-medium text-gray-600">Amount</th>
                  <th class="text-center py-3 px-4 font-medium text-gray-600">Date</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                  <th class="text-right py-3 px-4 font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                @for (expense of expenses(); track expense.id) {
                  <tr class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-3 px-4">{{ expense.description }}</td>
                    <td class="py-3 px-4 text-right font-medium">{{ expense.amount | currencyFormat }}€</td>
                    <td class="py-3 px-4 text-center">{{ expense.date | date:'yyyy-MM-dd' }}</td>
                    <td class="py-3 px-4">{{ expense.categoryName }}</td>
                    <td class="py-3 px-4 text-right space-x-2">
                      @if (confirmingId() === expense.id) {
                        <span class="text-sm text-gray-500 mr-2">Delete?</span>
                        <button (click)="confirmDelete(expense.id)" class="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700">Yes</button>
                        <button (click)="confirmingId.set(null)" class="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-200">No</button>
                      } @else {
                        <button (click)="editExpense(expense)" class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">Edit</button>
                        <button (click)="confirmingId.set(expense.id)" class="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700">Delete</button>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="5" class="py-8 text-center text-gray-500">No expenses found</td></tr>
                }
              </tbody>
            </table>
          </div>
        }
      </app-card>

      @if (showForm) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" (click)="showForm = false">
          <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4" (click)="$event.stopPropagation()">
            <h2 class="text-xl font-bold text-gray-900 mb-4">{{ editId ? 'Edit' : 'Add' }} Expense</h2>
            @if (formError()) {
              <div class="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{{ formError() }}</div>
            }
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" [(ngModel)]="formDescription"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input type="number" step="0.01" [(ngModel)]="formAmount"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" [(ngModel)]="formDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select [(ngModel)]="formCategoryId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand">
                  <option [value]="0">Select category</option>
                  @for (cat of categories(); track cat.id) {
                    <option [value]="cat.id">{{ cat.name }}</option>
                  }
                </select>
              </div>
              <div class="flex space-x-3">
                <app-button [loading]="saving()" (clicked)="saveExpense()">{{ editId ? 'Update' : 'Create' }}</app-button>
                <app-button variant="secondary" (clicked)="showForm = false">Cancel</app-button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  standalone: true,
  imports: [DatePipe, FormsModule, CardComponent, ButtonComponent, LoadingSpinnerComponent, CurrencyFormatPipe]
})
export class ExpensesListComponent {
  private expenseService = inject(ExpenseService);
  private categoryService = inject(CategoryService);

  expenses = signal<ExpenseDto[]>([]);
  categories = signal<CategoryDto[]>([]);
  loading = signal(true);
  saving = signal(false);
  confirmingId = signal<string | null>(null);
  showForm = false;
  editId: string | null = null;
  formDescription = '';
  formAmount = 0;
  formDate = '';
  formCategoryId = 0;
  formError = signal('');

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this.expenseService.getAll({ pageSize: 100 }).subscribe({
      next: (res) => { if (res.success && res.data) this.expenses.set(res.data.items); this.loading.set(false); }
    });
    this.categoryService.getAll().subscribe({
      next: (res) => { if (res.success && res.data) this.categories.set(res.data); }
    });
  }

  resetForm(): void {
    this.formDescription = '';
    this.formAmount = 0;
    this.formDate = new Date().toISOString().split('T')[0];
    this.formCategoryId = 0;
    this.formError.set('');
  }

  editExpense(expense: ExpenseDto): void {
    this.editId = expense.id;
    this.formDescription = expense.description;
    this.formAmount = expense.amount;
    this.formDate = expense.date.split('T')[0];
    this.formCategoryId = expense.categoryId;
    this.showForm = true;
  }

  saveExpense(): void {
    if (!this.formDescription || !this.formAmount || !this.formCategoryId) {
      this.formError.set('Please fill all required fields');
      return;
    }
    this.saving.set(true);
    const dto = {
      description: this.formDescription,
      amount: this.formAmount,
      date: this.formDate ? new Date(this.formDate).toISOString() : new Date().toISOString(),
      categoryId: this.formCategoryId
    };

    const request = this.editId
      ? this.expenseService.update(this.editId, dto)
      : this.expenseService.create(dto);

    request.subscribe({
      next: (res) => {
        if (res.success) {
          this.showForm = false;
          this.loadData();
        } else {
          this.formError.set(res.message || 'Operation failed');
        }
        this.saving.set(false);
      },
      error: () => { this.formError.set('Operation failed'); this.saving.set(false); }
    });
  }

  confirmDelete(id: string): void {
    this.confirmingId.set(null);
    this.expenseService.delete(id).subscribe({
      next: () => this.loadData()
    });
  }
}
