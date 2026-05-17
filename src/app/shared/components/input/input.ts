import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  template: `
    <div>
      @if (label()) {
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ label() }}</label>
      }
      <input
        [type]="type()"
        [placeholder]="placeholder()"
        [value]="value()"
        (input)="valueChange.emit($any($event.target).value)"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
      />
    </div>
  `,
  standalone: true,
  imports: [FormsModule]
})
export class InputComponent {
  label = input('');
  type = input<'text' | 'number' | 'email' | 'password' | 'date'>('text');
  placeholder = input('');
  value = input<string | number>('');
  valueChange = output<string | number>();
}
