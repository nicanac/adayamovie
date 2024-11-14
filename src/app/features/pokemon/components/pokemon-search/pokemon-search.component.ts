import { Component, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../services/pokemon.service';
import { HighlightPipe } from '../../../../shared/pipes/highlight.pipe';

@Component({
  selector: 'app-pokemon-search',
  standalone: true,
  imports: [CommonModule, FormsModule, HighlightPipe],
  template: `
    <div class="relative w-full">
      <div class="relative flex items-center">
        <div class="absolute left-4 flex items-center">
          <svg
            class="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          [ngModel]="searchTerm()"
          (ngModelChange)="searchTerm.set($event); onSearchChange($event)"
          (focus)="onInputFocus()"
          (blur)="onInputBlur()"
          (keyup.enter)="search()"
          placeholder="Search a pokemon"
          class="w-full pl-12 pr-4 py-3 border-0 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors duration-200"
        />
      </div>

      @if ((isInputFocused() && searchHistory().length > 0) ||
      (suggestions().length > 0 && searchTerm().length >= 2)) {
      <div
        class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-auto"
      >
        @if (searchHistory().length > 0) {
        <div class="p-3">
          <div class="text-xs text-gray-500 mb-2">Recent searches</div>
          <div class="flex flex-wrap gap-2">
            @for (item of searchHistory(); track item) {
            <button
              (click)="selectSuggestion(item)"
              (mousedown)="$event.preventDefault()"
              class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors duration-150"
              [innerHTML]="item | titlecase | highlight : searchTerm()"
            ></button>
            }
          </div>
        </div>
        } @if (suggestions().length > 0 && searchTerm().length >= 2) {
        <div class="border-t border-gray-100">
          @for (suggestion of suggestions(); track suggestion) {
          <button
            (click)="selectSuggestion(suggestion)"
            (mousedown)="$event.preventDefault()"
            class="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150"
            [innerHTML]="suggestion | titlecase | highlight : searchTerm()"
          ></button>
          }
        </div>
        }
      </div>
      } @if (error()) {
      <p class="text-red-500 text-sm mt-2">{{ error() }}</p>
      }
    </div>
  `,
  styles: [
    `
      :host ::ng-deep strong {
        font-weight: 600;
        color: #2563eb;
      }
    `,
  ],
})
export class PokemonSearchComponent {
  isLoading = input<boolean>(false);
  error = input<string | undefined>(undefined);
  searchSubmitted = output<string>();

  searchTerm = signal('');
  suggestions = signal<string[]>([]);
  searchHistory = signal<string[]>([]);
  isInputFocused = signal(false);
  private readonly MAX_HISTORY = 8;
  private readonly STORAGE_KEY = 'pokemon-search-history';

  constructor(private pokemonService: PokemonService) {
    this.loadSearchHistory();
  }

  private loadSearchHistory() {
    const history = localStorage.getItem(this.STORAGE_KEY);
    this.searchHistory.set(history ? JSON.parse(history) : []);
  }

  private saveSearchHistory() {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.searchHistory())
    );
  }

  onInputFocus() {
    this.isInputFocused.set(true);
  }

  onInputBlur() {
    setTimeout(() => {
      this.isInputFocused.set(false);
    }, 200);
  }

  onSearchChange(term: string) {
    if (term.length >= 2) {
      this.suggestions.set(this.pokemonService.filterPokemon(term));
    } else {
      this.suggestions.set([]);
    }
  }

  selectSuggestion(pokemon: string) {
    this.searchTerm.set(pokemon);
    this.suggestions.set([]);
    this.search();
  }

  search() {
    if (!this.searchTerm().trim()) {
      return;
    }
    const term = this.searchTerm().toLowerCase();
    this.searchHistory.set(
      [term, ...this.searchHistory().filter((item) => item !== term)].slice(
        0,
        this.MAX_HISTORY
      )
    );
    this.saveSearchHistory();
    this.suggestions.set([]);
    this.searchSubmitted.emit(term);
  }
}
