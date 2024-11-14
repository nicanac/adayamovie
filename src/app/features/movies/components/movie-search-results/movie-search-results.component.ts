import {
  Component,
  EventEmitter,
  inject,
  input,
  output,
  signal,
  effect,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieData } from '../../../../shared/types/movie-data.type';
import { AuthService } from '../../../../core/services/auth.service';
import { StreamingService } from '../../services/streaming.service';
import { StreamingProvider } from '../../../../shared/types/streaming.types';
@Component({
  selector: 'app-movie-search-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (movie of filteredMovies(); track movie.id) {
        <div
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col transform hover:scale-[1.02]"
        >
          <div class="relative h-48">
            @if (movie.backdrop_path) {
            <img
              [src]="'https://image.tmdb.org/t/p/w500' + movie.backdrop_path"
              [alt]="movie.title"
              class="w-full h-full object-cover rounded-t-lg"
            />
            } @else {
            <div
              class="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-lg"
            >
              <span class="text-gray-400">No image available</span>
            </div>
            } @if (authService.isAuthenticated()) {
            <button
              (click)="toggleFavorite(movie); $event.stopPropagation()"
              class="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors shadow-md"
              [class.text-red-500]="isFavorite(movie.id)"
              [class.text-gray-400]="!isFavorite(movie.id)"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>
            }
          </div>
          <div class="p-4 flex-1 flex flex-col">
            <div class="flex-1">
              <h3 class="font-bold text-lg mb-2">{{ movie.title }}</h3>
              <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span>{{ movie.release_date | date : 'yyyy' }}</span>
                <span>•</span>
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 text-yellow-400 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                  {{ movie.vote_average.toFixed(1) }}
                </div>
              </div>
              <p class="text-sm text-gray-600 line-clamp-2">
                {{ movie.overview }}
              </p>
            </div>
            <button
              (click)="selectMovie.emit(movie)"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 mt-4"
            >
              View Details
            </button>
            @if (movieStreamingProviders()[movie.id]) {
            <div class="flex flex-wrap gap-2 mt-2">
              @for (provider of movieStreamingProviders()[movie.id]; track
              provider.provider_id) {
              <img
                [src]="
                  'https://image.tmdb.org/t/p/original' + provider.logo_path
                "
                [alt]="provider.provider_name"
                class="h-6 w-6 rounded"
                [title]="provider.provider_name"
              />
              }
            </div>
            }
          </div>
        </div>
        }
      </div>
    </div>
  `,
})
export class MovieSearchResultsComponent {
  movies = input.required<MovieData[]>();
  selectedStreamingProvider = input<StreamingProvider | null>();
  selectMovie = output<MovieData>();

  public authService = inject(AuthService);
  private favoriteMovies = signal<Set<number>>(new Set());
  movieStreamingProviders = signal<Record<number, StreamingProvider[]>>({});

  private streamingService = inject(StreamingService);

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.loadFavorites();
    }
    effect(() => {
      this.movies().forEach((movie) => {
        this.streamingService.getMovieAvailability(movie.id).subscribe({
          next: (availability) => {
            const flatrate = availability.results?.['BE']?.flatrate;
            if (flatrate && flatrate.length > 0) {
              this.movieStreamingProviders.update((providers) => ({
                ...providers,
                [movie.id]: flatrate,
              }));
            }
          },
        });
      });
    });
  }

  private loadFavorites() {
    this.authService.getFavoriteMovies().subscribe({
      next: (movies) => {
        this.favoriteMovies.set(new Set(movies.map((m) => m.id)));
      },
      error: (err) => console.error('Error loading favorites:', err),
    });
  }

  isFavorite(movieId: number): boolean {
    return this.favoriteMovies().has(movieId);
  }

  toggleFavorite(movie: MovieData, event?: Event) {
    event?.stopPropagation();
    const isFav = this.isFavorite(movie.id);

    const action = isFav
      ? this.authService.removeFromFavorites(movie.id)
      : this.authService.addToFavorites(movie.id);

    action.subscribe({
      next: () => {
        const currentFavorites = new Set(this.favoriteMovies());
        if (isFav) {
          currentFavorites.delete(movie.id);
        } else {
          currentFavorites.add(movie.id);
        }
        this.favoriteMovies.set(currentFavorites);
      },
      error: (err) => console.error('Error toggling favorite:', err),
    });
  }

  filteredMovies = computed(() => {
    const selectedProvider = this.selectedStreamingProvider();
    const movies = this.movies();

    if (!selectedProvider) {
      return movies;
    }

    return movies.filter((movie) => {
      const providers = this.movieStreamingProviders()[movie.id];
      return providers?.some(
        (provider) => provider.provider_id === selectedProvider.provider_id
      );
    });
  });
}
