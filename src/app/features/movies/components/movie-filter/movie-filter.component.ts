import { AuthService } from './../../../../core/services/auth.service';
import { WatchedMoviesService } from './../../services/watched-movie.service';
import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamingSelectorComponent } from '../streaming/streaming-selector/streaming-selector.component';
import { RatingSelectorComponent } from '../rating-selector/rating-selector.component';
import { MovieDiscoverStore } from '../../stores/movie-discover.store';
import { MovieSearchResultsComponent } from '../movie-search-results/movie-search-results.component';
import { StreamingProviderStore } from '../../stores/streaming-provider.store';

@Component({
  selector: 'app-movie-filter',
  standalone: true,
  imports: [
    CommonModule,
    StreamingSelectorComponent,
    RatingSelectorComponent,
    MovieSearchResultsComponent,
  ],
  template: `
    <div class="relative w-full">
      <div class="relative">
        <div class="relative flex items-center gap-4">
          <app-rating-selector
            (ratingChanged)="discoverStore.setRatingThreshold($event)"
          />
          <app-streaming-selector
            (providersChanged)="onProvidersChanged($event)"
          />
          <select
            (change)="onWatchedFilterChange($event)"
            class="px-4 py-3 border-0 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors duration-200"
          >
            <option value="all">All Movies</option>
            <option value="unwatched">Unwatched Only</option>
            <option value="watched">Watched Only</option>
          </select>
          <button
            (click)="search()"
            class="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Search Movies
          </button>
        </div>

        @if (discoverStore.error()) {
        <p class="text-red-500 text-sm mt-2">{{ discoverStore.error() }}</p>
        } @if (discoverStore.movies().length > 0) {
        <app-movie-search-results [movies]="filteredMovies()" />
        }
      </div>
    </div>
  `,
})
export class MovieFilterComponent {
  private watchedFilter = signal<'all' | 'watched' | 'unwatched'>('all');
  private watchedMoviesService = inject(WatchedMoviesService);
  private authService = inject(AuthService);
  private watchedMovieIds = signal<Set<number>>(new Set());

  constructor(
    protected discoverStore: MovieDiscoverStore,
    private streamingProviderStore: StreamingProviderStore
  ) {
    this.loadWatchedMovies();
  }

  private loadWatchedMovies(): void {
    if (!this.authService.isAuthenticated()) return;

    const sessionId = this.authService.getSessionId();
    if (!sessionId) return;

    this.watchedMoviesService.getWatchedMovies(sessionId).subscribe({
      next: (movies) => {
        this.watchedMovieIds.set(new Set(movies.map((m: any) => m.id)));
      },
      error: (error) => console.error('Failed to load watched movies:', error),
    });
  }

  filteredMovies = computed(() => {
    const movies = this.discoverStore.movies();
    const filter = this.watchedFilter();
    const watchedIds = this.watchedMovieIds();

    switch (filter) {
      case 'watched':
        return movies.filter((movie) => watchedIds.has(movie.id));
      case 'unwatched':
        return movies.filter((movie) => !watchedIds.has(movie.id));
      default:
        return movies;
    }
  });

  onWatchedFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as
      | 'all'
      | 'watched'
      | 'unwatched';
    this.watchedFilter.set(value);
  }

  ngOnInit() {
    this.discoverStore.clearResults();
  }

  onProvidersChanged(providers: number[]) {
    this.streamingProviderStore.updateSelectedProviders(providers);
    this.discoverStore.discoverMovies();
  }

  search() {
    this.discoverStore.discoverMovies();
  }
}
