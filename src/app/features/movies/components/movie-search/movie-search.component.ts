import { Component, signal, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from '../../../../shared/pipes/highlight.pipe';
import { MovieData } from '../../../../shared/types/movie-data.type';
import { MovieService } from '../../services/movie.service';
import { StreamingSelectorComponent } from '../streaming/streaming-selector/streaming-selector.component';
import { MovieSearchStore } from '../../stores/movie-search.store';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HighlightPipe,
    StreamingSelectorComponent,
  ],
  template: `
    <div class="relative w-full">
      <div class="relative w-[600px]">
        <div class="relative flex items-center gap-4">
          <div class="relative flex-1">
            <div
              class="absolute inset-y-0 left-5 flex items-center pointer-events-none"
            >
              <svg
                class="h-6 w-6 text-gray-400"
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
              [ngModel]="searchStore.searchTerm()"
              (ngModelChange)="onSearchTermChange($event)"
              (focus)="isInputFocused.set(true)"
              (blur)="onInputBlur()"
              (keyup.enter)="search()"
              placeholder="Search movies"
              class="w-full pl-14 pr-4 py-3 border-0 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors duration-200"
            />
          </div>
          <app-streaming-selector
            (providersChanged)="onProvidersChanged($event)"
          />
        </div>

        @if (isInputFocused() && (searchStore.suggestions().length > 0 ||
        searchStore.searchHistory().length > 0)) {
        <div
          class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          @if (searchStore.suggestions().length > 0) {
          <div class="p-3">
            <div class="text-xs text-gray-500 mb-2">Suggestions</div>
            <ul>
              @for (movie of searchStore.suggestions(); track movie.id) {
              <li
                class="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
                (click)="selectMovie(movie)"
              >
                <span
                  [innerHTML]="
                    movie.title
                      | titlecase
                      | highlight : searchStore.searchTerm()
                  "
                ></span>
                <span class="text-sm text-gray-500"
                  >({{ movie.release_date | date : 'yyyy' }})</span
                >
              </li>
              }
            </ul>
          </div>
          } @if (searchStore.searchHistory().length > 0) {
          <div class="p-3 border-t border-gray-100">
            <div class="text-xs text-gray-500 mb-2">Recent searches</div>
            <div class="flex flex-wrap gap-2">
              @for (movie of searchStore.searchHistory(); track movie.id) {
              <button
                (click)="selectMovie(movie)"
                class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
              >
                {{ movie.title }}
              </button>
              }
            </div>
          </div>
          }
        </div>
        } @if (searchStore.error()) {
        <p class="text-red-500 text-sm mt-2">{{ searchStore.error() }}</p>
        }
      </div>
    </div>
  `,
})
export class MovieSearchComponent {
  isLoading = input<boolean>(false);
  error = input<string | undefined>(undefined);
  searchSubmitted = output<MovieData>();

  isInputFocused = signal(false);
  maxSuggestions = 5;

  constructor(protected searchStore: MovieSearchStore) {}

  onSearchTermChange(term: string) {
    this.searchStore.updateSearchTerm(term);
    this.searchStore.searchMovies(term, this.maxSuggestions);
  }

  onInputBlur() {
    setTimeout(() => {
      this.isInputFocused.set(false);
    }, 200);
  }

  onProvidersChanged(providers: number[]) {
    this.searchStore.updateSelectedProviders(providers);
  }

  selectMovie(movie: MovieData) {
    console.log('Selecting movie:', movie);
    this.searchStore.setSelectedMovie(movie);
    this.searchStore.searchMovies(movie.title); // This will load all related movies
    this.isInputFocused.set(false);
    this.searchSubmitted.emit(movie);
  }

  search() {
    const term = this.searchStore.searchTerm();
    if (term.length >= 2) {
      this.searchStore.searchMovies(term);
      this.isInputFocused.set(false);
    }
  }
}
