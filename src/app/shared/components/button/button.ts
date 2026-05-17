import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button [disabled]="disabled() || loading()"
      [class]="'px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ' + variantClass()"
      (click)="clicked.emit()">
      @if (loading()) {
        <span class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Loading...
        </span>
      } @else {
        <ng-content></ng-content>
      }
    </button>
  `,
  standalone: true
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'danger'>('primary');
  disabled = input(false);
  loading = input(false);
  clicked = output<void>();

  variantClass(): string {
    switch (this.variant()) {
      case 'primary': return 'bg-brand text-white hover:bg-brand-dark';
      case 'secondary': return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
      case 'danger': return 'bg-red-600 text-white hover:bg-red-700';
    }
  }
}
