import { Component, signal, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from '../../../../shared/pipes/highlight.pipe';
import { MovieData } from '../../../../shared/types/movie-data.type';
import { MovieService } from '../../services/movie.service';
import { StreamingSelectorComponent } from '../streaming/streaming-selector/streaming-selector.component';
import { StreamingService } from '../../services/streaming.service';

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
        <!-- Changed from w-full -->
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
              [ngModel]="searchTerm()"
              (ngModelChange)="searchTerm.set($event); onSearchChange($event)"
              (focus)="onInputFocus()"
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

        @if (isInputFocused() && (suggestions().length > 0 ||
        searchHistory().length > 0)) {
        <div
          class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          @if (suggestions().length > 0) {
          <div class="p-3">
            <div class="text-xs text-gray-500 mb-2">Suggestions</div>
            <ul>
              @for (movie of suggestions(); track movie.id) {
              <li
                class="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
                (click)="selectMovie(movie)"
              >
                <span
                  [innerHTML]="
                    movie.title | titlecase | highlight : searchTerm()
                  "
                ></span>
                <span class="text-sm text-gray-500">
                  ({{ movie.release_date | date : 'yyyy' }})
                </span>
              </li>
              }
            </ul>
          </div>
          } @if (searchHistory().length > 0) {
          <div class="p-3 border-t border-gray-100">
            <div class="text-xs text-gray-500 mb-2">Recent searches</div>
            <div class="flex flex-wrap gap-2">
              @for (item of searchHistory(); track item.title) {
              <button
                (click)="selectMovie(item)"
                class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
              >
                {{ item.title }}
              </button>
              }
            </div>
          </div>
          }
        </div>
        } @if (error()) {
        <p class="text-red-500 text-sm mt-2">{{ error()?.toString() }}</p>
        }
      </div>
    </div>
  `,
})
export class MovieSearchComponent {
  isLoading = input<boolean>(false);
  maxSuggestions = 5;
  error = input<string | undefined>(undefined);
  searchSubmitted = output<string>();
  errorOccurred = output<string>();
  selectedProviders = signal<number[]>([]);

  // Add a local loading signal
  #loading = signal(false);

  searchTerm = signal('');
  suggestions = signal<MovieData[]>([]);
  isInputFocused = signal(false);
  searchHistory = signal<MovieData[]>([]);

  constructor(
    private movieService: MovieService,
    private streamingService: StreamingService
  ) {}

  onSearchChange(term: string) {
    if (term.length >= 2) {
      this.#loading.set(true);
      this.movieService.searchMovies(term).subscribe({
        next: (movies) => {
          if (this.selectedProviders().length > 0) {
            const availabilityPromises = movies.map(movie =>
              this.streamingService.getMovieAvailability(movie.id).toPromise()
            );

            Promise.all(availabilityPromises).then(availabilities => {
              const filteredMovies = movies.filter((movie, index) => {
                const availability = availabilities[index];
                if (!availability?.results?.['BE']?.flatrate) return false;
                
                const movieProviders = availability.results['BE'].flatrate.map(p => p.provider_id);
                return this.selectedProviders().some(id => movieProviders.includes(id));
              });

              const sortedMovies = filteredMovies
                .sort((a, b) => b.popularity - a.popularity)
                .slice(0, this.maxSuggestions);
              
              this.suggestions.set(sortedMovies);
              this.#loading.set(false);
            });
          } else {
            const sortedMovies = movies
              .sort((a, b) => b.popularity - a.popularity)
              .slice(0, this.maxSuggestions);
            this.suggestions.set(sortedMovies);
            this.#loading.set(false);
          }
        },
        error: (err) => {
          this.suggestions.set([]);
          this.#loading.set(false);
          this.errorOccurred.emit(`API Error: ${err.message}`);
          console.error('Search error:', err);
        },
      });
    } else {
      this.suggestions.set([]);
      this.errorOccurred.emit('');
    }
  }

  onInputFocus() {
    this.isInputFocused.set(true);
  }

  onInputBlur() {
    setTimeout(() => this.isInputFocused.set(false), 200);
  }

  search() {
    if (this.searchTerm().trim()) {
      this.searchSubmitted.emit(this.searchTerm().trim());
    }
  }

  selectMovie(movie: MovieData) {
    this.searchTerm.set(movie.title);
    if (!this.searchHistory().some((m) => m.id === movie.id)) {
      this.searchHistory.update((history) => [movie, ...history].slice(0, 5));
    }
    this.search();
  }

  onProvidersChanged(providerIds: number[]) {
    console.log('onProvidersChanged', providerIds);
    this.selectedProviders.set(providerIds);
    if (this.searchTerm().length >= 2) {
      this.onSearchChange(this.searchTerm());
    }
  }
}
