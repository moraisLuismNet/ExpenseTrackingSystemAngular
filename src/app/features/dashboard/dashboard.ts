import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../core/services/expense.service';
import { BudgetService } from '../../core/services/budget.service';
import { ExportService } from '../../core/services/export.service';
import { CardComponent } from '../../shared/components/card/card';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format';
import { BudgetDto, ExpenseSummaryDto, ExpenseMonthDto } from '../../core/models/api.models';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      @if (loading()) {
        <app-loading-spinner />
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <app-card>
            <p class="text-sm text-gray-500">Total Spent</p>
            <p class="text-2xl font-bold text-gray-900">{{ (summary()?.totalAmount ?? 0) | currencyFormat }}€ / {{ (currentBudget()?.amount ?? 0) | currencyFormat }}€</p>
          </app-card>
          <app-card>
            <p class="text-sm text-gray-500">Transactions</p>
            <p class="text-2xl font-bold text-gray-900">{{ summary()?.totalCount ?? 0 }}</p>
          </app-card>
          <app-card>
            <p class="text-sm text-gray-500">Remaining</p>
            <p class="text-2xl font-bold text-gray-900">{{ (currentBudget()?.remainingAmount ?? 0) | currencyFormat }}€ / {{ (currentBudget()?.amount ?? 0) | currencyFormat }}€</p>
          </app-card>
        </div>

        <app-card>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Spending by Category</h3>
            <div class="flex items-center gap-2">
              <select [(ngModel)]="selectedMonthKey" class="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand">
                <option value="">All months</option>
                @for (m of availableMonths(); track m.month + '-' + m.year) {
                  <option [value]="m.month + '-' + m.year">{{ monthNames[m.month - 1] }} {{ m.year }}</option>
                }
              </select>
              <button (click)="exportCsv()" class="text-sm bg-brand text-white px-3 py-1.5 rounded hover:bg-brand-dark">Export CSV</button>
              <button (click)="exportPdf()" class="text-sm bg-brand text-white px-3 py-1.5 rounded hover:bg-brand-dark">Export PDF</button>
            </div>
          </div>
          @if (categoryKeys().length === 0) {
            <p class="text-gray-500 text-sm">No expenses yet</p>
          }
          @for (cat of categoryKeys(); track cat) {
            <div class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span class="text-sm text-gray-700">{{ cat }}</span>
              <span class="text-sm font-medium text-gray-900">{{ (summary()?.byCategory?.[cat] ?? 0) | currencyFormat }}€</span>
            </div>
          }
        </app-card>
      }
    </div>
  `,
  standalone: true,
  imports: [CardComponent, LoadingSpinnerComponent, CurrencyFormatPipe, FormsModule]
})
export class DashboardComponent {
  private expenseService = inject(ExpenseService);
  private budgetService = inject(BudgetService);
  private exportService = inject(ExportService);

  summary = signal<ExpenseSummaryDto | null>(null);
  currentBudget = signal<BudgetDto | null>(null);
  loading = signal(true);

  availableMonths = signal<ExpenseMonthDto[]>([]);
  selectedMonthKey = signal('');

  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  categoryKeys = () => this.summary()?.byCategory ? Object.keys(this.summary()!.byCategory) : [];

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this.expenseService.getSummary().subscribe({
      next: (res) => { if (res.success) this.summary.set(res.data); },
      error: () => this.loading.set(false),
      complete: () => this.checkLoading()
    });

    this.budgetService.getCurrent().subscribe({
      next: (res) => { if (res.success) this.currentBudget.set(res.data); },
      error: () => this.loading.set(false),
      complete: () => this.checkLoading()
    });

    this.expenseService.getMonths().subscribe({
      next: (res) => { if (res.success && res.data) this.availableMonths.set(res.data); },
      error: () => this.loading.set(false),
      complete: () => this.checkLoading()
    });
  }

  private requestsCompleted = 0;
  private checkLoading(): void {
    this.requestsCompleted++;
    if (this.requestsCompleted === 3) this.loading.set(false);
  }

  private dateStr = () => new Date().toISOString().slice(0, 10).replace(/-/g, '');

  private getSelectedMonthYear(): { month?: number; year?: number } {
    if (!this.selectedMonthKey()) return {};
    const [m, y] = this.selectedMonthKey().split('-').map(Number);
    return { month: m, year: y };
  }

  exportCsv(): void {
    const { month, year } = this.getSelectedMonthYear();
    this.exportService.downloadCsv(month, year).subscribe(blob => this.downloadBlob(blob, `expenses_${this.dateStr()}.csv`));
  }

  exportPdf(): void {
    const { month, year } = this.getSelectedMonthYear();
    this.exportService.downloadPdf(month, year).subscribe(blob => this.downloadBlob(blob, `expenses_${this.dateStr()}.pdf`));
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
