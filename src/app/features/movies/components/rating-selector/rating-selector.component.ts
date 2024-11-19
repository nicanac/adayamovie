import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <select
      (change)="onRatingChange($event)"
      class="px-4 py-3 border-0 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors duration-200"
    >
      <option value="">Any Rating</option>
      <option value="5">5+ Stars</option>
      <option value="6">6+ Stars</option>
      <option value="7">7+ Stars</option>
      <option value="8">8+ Stars</option>
      <option value="9">9+ Stars</option>
    </select>
  `,
})
export class RatingSelectorComponent {
  ratingChanged = output<number | null>();

  onRatingChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.ratingChanged.emit(value ? +value : null);
  }
}
