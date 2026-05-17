import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { CardComponent } from '../../../shared/components/card/card';
import { ButtonComponent } from '../../../shared/components/button/button';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { CategoryDto } from '../../../core/models/api.models';

@Component({
  selector: 'app-categories-list',
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Categories</h1>
        <app-button (clicked)="showForm = true; editId = null; resetForm()">Add Category</app-button>
      </div>

      <app-card>
        @if (loading()) {
          <app-loading-spinner />
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                  <th class="text-center py-3 px-4 font-medium text-gray-600">Expenses</th>
                  <th class="text-right py-3 px-4 font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                @for (cat of categories(); track cat.id) {
                  <tr class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-3 px-4 font-medium">{{ cat.name }}</td>
                    <td class="py-3 px-4 text-gray-600">{{ cat.description }}</td>
                    <td class="py-3 px-4 text-center">{{ cat.expenseCount }}</td>
                    <td class="py-3 px-4 text-right space-x-2">
                      @if (confirmingId() === cat.id) {
                        <span class="text-sm text-gray-500 mr-2">Delete?</span>
                        <button [disabled]="cat.expenseCount !== 0" (click)="confirmDelete(cat.id)" class="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">Yes</button>
                        <button (click)="confirmingId.set(null)" class="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-200">No</button>
                      } @else {
                        <button (click)="editCategory(cat)" class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">Edit</button>
                        <button [disabled]="cat.expenseCount !== 0" (click)="confirmingId.set(cat.id)" class="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">Delete</button>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="4" class="py-8 text-center text-gray-500">No categories found</td></tr>
                }
              </tbody>
            </table>
          </div>
        }
      </app-card>

      @if (showForm) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" (click)="showForm = false">
          <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4" (click)="$event.stopPropagation()">
            <h2 class="text-xl font-bold text-gray-900 mb-4">{{ editId ? 'Edit' : 'Add' }} Category</h2>
            @if (formError()) {
              <div class="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{{ formError() }}</div>
            }
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" [(ngModel)]="formName"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea [(ngModel)]="formDescription" rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"></textarea>
              </div>
              <div class="flex space-x-3">
                <app-button [loading]="saving()" (clicked)="saveCategory()">{{ editId ? 'Update' : 'Create' }}</app-button>
                <app-button variant="secondary" (clicked)="showForm = false">Cancel</app-button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  standalone: true,
  imports: [FormsModule, CardComponent, ButtonComponent, LoadingSpinnerComponent]
})
export class CategoriesListComponent {
  private categoryService = inject(CategoryService);

  categories = signal<CategoryDto[]>([]);
  loading = signal(true);
  confirmingId = signal<number | null>(null);
  saving = signal(false);
  showForm = false;
  editId: number | null = null;
  formName = '';
  formDescription = '';
  formError = signal('');

  constructor() {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (res) => { if (res.success && res.data) this.categories.set(res.data); this.loading.set(false); }
    });
  }

  resetForm(): void {
    this.formName = '';
    this.formDescription = '';
    this.formError.set('');
  }

  editCategory(cat: CategoryDto): void {
    this.editId = cat.id;
    this.formName = cat.name;
    this.formDescription = cat.description;
    this.showForm = true;
  }

  saveCategory(): void {
    if (!this.formName) {
      this.formError.set('Name is required');
      return;
    }
    this.saving.set(true);
    const dto = { name: this.formName, description: this.formDescription };

    const request = this.editId
      ? this.categoryService.update(this.editId, dto)
      : this.categoryService.create(dto);

    request.subscribe({
      next: (res) => {
        if (res.success) {
          this.showForm = false;
          this.loadCategories();
        } else {
          this.formError.set(res.message || 'Operation failed');
        }
        this.saving.set(false);
      },
      error: () => { this.formError.set('Operation failed'); this.saving.set(false); }
    });
  }

  confirmDelete(id: number): void {
    this.confirmingId.set(null);
    this.categoryService.delete(id).subscribe({
      next: () => this.loadCategories()
    });
  }
}
