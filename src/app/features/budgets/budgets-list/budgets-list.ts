import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../../core/services/budget.service';
import { CardComponent } from '../../../shared/components/card/card';
import { ButtonComponent } from '../../../shared/components/button/button';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { BudgetDto } from '../../../core/models/api.models';

@Component({
  selector: 'app-budgets-list',
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Budgets</h1>
        <app-button (clicked)="showForm = true; editMonthYear = null; resetForm()">Create Budget</app-button>
      </div>

      @if (loading()) {
        <app-loading-spinner />
      } @else {
        @if (currentBudget(); as cb) {
          <app-card>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Current Month Budget</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p class="text-xs text-gray-500">Amount</p>
                <p class="text-xl font-bold text-gray-900">{{ cb.amount | currencyFormat }}€</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Spent</p>
                <p class="text-xl font-bold text-gray-900">{{ cb.spentAmount | currencyFormat }}€</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Remaining</p>
                <p class="text-xl font-bold" [class.text-green-600]="!cb.isOverBudget" [class.text-red-600]="cb.isOverBudget">
                  {{ cb.remainingAmount | currencyFormat }}€
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Status</p>
                <app-status-badge
                  [variant]="cb.percentSpent >= 100 ? 'red' : cb.percentSpent >= 75 ? 'yellow' : 'green'"
                  [text]="cb.percentSpent.toFixed(1) + '% used'"/>
              </div>
            </div>
            <div class="bg-gray-200 rounded-full h-3">
              <div class="rounded-full h-3 transition-all"
                [class.bg-green-500]="cb.percentSpent < 75"
                [class.bg-yellow-500]="cb.percentSpent >= 75 && cb.percentSpent < 100"
                [class.bg-red-500]="cb.percentSpent >= 100"
                [style.width.%]="Math.min(cb.percentSpent, 100)">
              </div>
            </div>
          </app-card>
        }

        <div class="mt-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">All Budgets</h3>
          <app-card>
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4 font-medium text-gray-600">Period</th>
                  <th class="text-right py-3 px-4 font-medium text-gray-600">Amount</th>
                  <th class="text-right py-3 px-4 font-medium text-gray-600">Spent</th>
                  <th class="text-right py-3 px-4 font-medium text-gray-600">Remaining</th>
                  <th class="text-center py-3 px-4 font-medium text-gray-600">Progress</th>
                  <th class="text-right py-3 px-4 font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                @for (b of budgets(); track b.monthYear) {
                  <tr class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-3 px-4">{{ b.monthYear }}</td>
                    <td class="py-3 px-4 text-right">{{ b.amount | currencyFormat }}€</td>
                    <td class="py-3 px-4 text-right">{{ b.spentAmount | currencyFormat }}€</td>
                    <td class="py-3 px-4 text-right font-medium"
                      [class.text-green-600]="!b.isOverBudget" [class.text-red-600]="b.isOverBudget">
                      {{ b.remainingAmount | currencyFormat }}€
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center space-x-2">
                        <div class="flex-1 bg-gray-200 rounded-full h-2">
                          <div class="rounded-full h-2"
                            [class.bg-green-500]="b.percentSpent < 75"
                            [class.bg-yellow-500]="b.percentSpent >= 75 && b.percentSpent < 100"
                            [class.bg-red-500]="b.percentSpent >= 100"
                            [style.width.%]="Math.min(b.percentSpent, 100)">
                          </div>
                        </div>
                        <span class="text-xs text-gray-500 w-12 text-right">{{ b.percentSpent.toFixed(0) }}%</span>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-right space-x-2">
                      @if (confirmingId() === b.monthYear) {
                        <span class="text-sm text-gray-500 mr-2">Delete?</span>
                        <button (click)="confirmDelete(b.monthYear)" class="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700">Yes</button>
                        <button (click)="confirmingId.set(null)" class="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-200">No</button>
                      } @else {
                        <button (click)="editBudget(b)" class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">Edit</button>
                        <button [disabled]="isDeleteDisabled(b)"
                          (click)="confirmingId.set(b.monthYear)"
                          class="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">Delete</button>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="6" class="py-8 text-center text-gray-500">No budgets found</td></tr>
                }
              </tbody>
            </table>
          </app-card>
        </div>
      }

      @if (showForm) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" (click)="showForm = false">
          <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4" (click)="$event.stopPropagation()">
            <h2 class="text-xl font-bold text-gray-900 mb-4">{{ editMonthYear ? 'Edit' : 'Create' }} Budget</h2>
            @if (formError()) {
              <div class="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{{ formError() }}</div>
            }
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input type="number" step="0.01" [(ngModel)]="formAmount"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select [(ngModel)]="formMonth"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand">
                  <option value="0">Current month</option>
                  @for (m of months; track m.value) {
                    <option [value]="m.value">{{ m.label }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input type="number" [(ngModel)]="formYear"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"/>
              </div>
              <div class="flex space-x-3">
                <app-button [loading]="saving()" (clicked)="saveBudget()">{{ editMonthYear ? 'Update' : 'Create' }}</app-button>
                <app-button variant="secondary" (clicked)="showForm = false">Cancel</app-button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  standalone: true,
  imports: [FormsModule, CardComponent, ButtonComponent, LoadingSpinnerComponent, StatusBadgeComponent, CurrencyFormatPipe]
})
export class BudgetsListComponent {
  private budgetService = inject(BudgetService);

  protected Math = Math;

  protected isDeleteDisabled(b: BudgetDto): boolean {
    return b.amount > 0 || b.remainingAmount > 0;
  }

  months = [
    { value: 0, label: 'Current month' },
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  budgets = signal<BudgetDto[]>([]);
  currentBudget = signal<BudgetDto | null>(null);
  loading = signal(true);
  saving = signal(false);
  confirmingId = signal<string | null>(null);
  showForm = false;
  editMonthYear: string | null = null;
  formAmount = 0;
  formMonth = 0;
  formYear = 0;
  formError = signal('');

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this.budgetService.getCurrent().subscribe({
      next: (res) => { if (res.success) this.currentBudget.set(res.data); }
    });
    this.budgetService.getAll().subscribe({
      next: (res) => { if (res.success && res.data) this.budgets.set(res.data); this.loading.set(false); }
    });
  }

  resetForm(): void {
    this.formAmount = 0;
    this.formMonth = 0;
    this.formYear = new Date().getFullYear();
    this.formError.set('');
  }

  editBudget(b: BudgetDto): void {
    this.editMonthYear = b.monthYear;
    this.formAmount = b.amount;
    this.formMonth = b.month;
    this.formYear = b.year;
    this.showForm = true;
  }

  saveBudget(): void {
    if (!this.formAmount) {
      this.formError.set('Amount is required');
      return;
    }
    this.saving.set(true);
    const dto = {
      amount: this.formAmount,
      month: this.formMonth,
      year: this.formYear
    };

    const request = this.editMonthYear
      ? this.budgetService.update(this.editMonthYear, dto)
      : this.budgetService.create(dto);

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

  confirmDelete(monthYear: string): void {
    this.confirmingId.set(null);
    this.budgetService.delete(monthYear).subscribe({
      next: () => this.loadData()
    });
  }
}
