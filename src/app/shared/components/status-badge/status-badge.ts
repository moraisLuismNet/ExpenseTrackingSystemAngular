import { Component, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `
    <span [class]="'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' + badgeClass()">
      {{ label() || text() }}
    </span>
  `,
  standalone: true
})
export class StatusBadgeComponent {
  label = input('');
  text = input('');
  variant = input<'green' | 'yellow' | 'red' | 'blue' | 'gray'>('gray');

  badgeClass(): string {
    switch (this.variant()) {
      case 'green': return 'bg-green-100 text-green-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'red': return 'bg-red-100 text-red-800';
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'gray': return 'bg-gray-100 text-gray-800';
    }
  }
}
