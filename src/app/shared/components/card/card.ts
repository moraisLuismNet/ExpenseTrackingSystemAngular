import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <ng-content></ng-content>
    </div>
  `,
  standalone: true
})
export class CardComponent {}
