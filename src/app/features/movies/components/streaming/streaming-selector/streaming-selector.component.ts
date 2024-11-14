import { Component, inject, signal, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamingService } from '../../../services/streaming.service';
import { StreamingProvider } from '../../../../../shared/types/streaming.types';
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-streaming-selector',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  template: `
    <div class="relative inline-block">
      <button
        (click)="toggleDropdown()"
        class="flex items-center space-x-2 px-4 py-2 border rounded-full bg-white hover:bg-gray-50 transition-colors"
        [class.ring-2]="isOpen()"
        [class.ring-blue-500]="isOpen()"
      >
        <svg
          class="w-5 h-5 text-gray-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <span class="text-sm text-gray-700">Streaming</span>
        <span class="text-xs text-gray-500">({{ selectedCount() }})</span>
      </button>

      @if (isOpen()) {
      <div
        class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border p-4 z-50"
        (clickOutside)="isOpen.set(false)"
      >
        @if (loading()) {
        <div class="flex justify-center py-4">
          <div
            class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"
          ></div>
        </div>
        } @else if (error()) {
        <div class="text-red-500 text-sm text-center py-2">
          {{ error() }}
        </div>
        } @else {
        <div class="space-y-3">
          @for (provider of providers(); track provider.provider_id) {
          <label
            class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
          >
            <input
              type="checkbox"
              [checked]="isSelected(provider.provider_id)"
              (change)="toggleProvider(provider)"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <img
              [src]="'https://image.tmdb.org/t/p/original' + provider.logo_path"
              [alt]="provider.provider_name"
              class="h-6 w-6 rounded"
            />
            <span class="text-sm text-gray-700">{{
              provider.provider_name
            }}</span>
          </label>
          }
        </div>
        }
      </div>
      }
    </div>
  `,
})
export class StreamingSelectorComponent {
  providers = signal<StreamingProvider[]>([]);
  selectedProviders = signal<Set<number>>(new Set());
  isOpen = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  selectedCount = computed(() => this.selectedProviders().size);
  providersChanged = output<number[]>();

  private streamingService = inject(StreamingService);

  constructor() {
    this.loadProviders();
  }

  private loadProviders() {
    this.loading.set(true);
    this.streamingService.getStreamingProviders().subscribe({
      next: (providers) => {
        this.providers.set(providers);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load streaming providers');
        this.loading.set(false);
        console.error('Error loading providers:', err);
      },
    });
  }

  toggleDropdown() {
    this.isOpen.update((v) => !v);
  }

  isSelected(id: number): boolean {
    const result = this.selectedProviders().has(id);
    console.log(`Checking if ${id} is selected:`, result);
    return result;
  }

  toggleProvider(provider: StreamingProvider) {
    const currentSelected = new Set(this.selectedProviders());

    if (currentSelected.has(provider.provider_id)) {
      currentSelected.delete(provider.provider_id);
    } else {
      currentSelected.add(provider.provider_id);
    }

    this.selectedProviders.set(currentSelected);
    this.providersChanged.emit(Array.from(currentSelected));
  }
}
