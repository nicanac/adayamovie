import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieData } from '../../../../shared/types/movie-data.type';
import { MovieService } from '../../services/movie.service';
import { MovieSearchResultsComponent } from '../movie-search-results/movie-search-results.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, MovieSearchResultsComponent],
  template: `
    <div class="container mx-auto">
      @if (isLoading()) {
      <div class="flex justify-center items-center h-64">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
        ></div>
      </div>
      } @else if (error()) {
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-600">{{ error() }}</p>
      </div>
      } @else if (selectedMovie()) {
      <div class="bg-white rounded-lg shadow-lg p-6">
        <button
          (click)="clearSelectedMovie()"
          class="mb-4 flex items-center text-blue-500 hover:text-blue-600 transition-colors"
        >
          <svg
            class="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Movies
        </button>
        <div class="flex flex-col md:flex-row gap-8">
          @if (selectedMovie()?.backdrop_path) {
          <img
            [src]="
              'https://image.tmdb.org/t/p/w500' + selectedMovie()?.backdrop_path
            "
            [alt]="selectedMovie()?.title"
            class="w-full md:w-1/3 rounded-lg"
          />
          }
          <div class="flex-1">
            <div class="flex justify-between items-start mb-4">
              <h2 class="text-3xl font-bold">
                {{ selectedMovie()?.title }}
              </h2>
              @if (authService.isAuthenticated()) {
              <button
                (click)="toggleFavorite()"
                class="p-2 hover:bg-gray-100 rounded-full transition-colors"
                [class.text-red-500]="isFavorite()"
                [class.text-gray-400]="!isFavorite()"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              </button>
              }
            </div>
            <p class="text-gray-600 mb-4">{{ selectedMovie()?.overview }}</p>
            <div class="flex items-center gap-4 text-sm text-gray-600">
              <span>{{ selectedMovie()?.release_date | date : 'yyyy' }}</span>
              <span>•</span>
              <div class="flex items-center">
                <svg
                  class="w-5 h-5 text-yellow-400 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                {{ selectedMovie()?.vote_average?.toFixed(1) ?? 'N/A' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      } @else {
      <app-movie-search-results
        [movies]="movies()"
        (selectMovie)="onSelectMovie($event)"
      />
      }
    </div>
  `,
})
export class MovieCardComponent {
  movies = signal<MovieData[]>([]);
  selectedMovie = signal<MovieData | null>(null);
  isLoading = signal(false);
  error = signal<string | undefined>(undefined);
  public authService = inject(AuthService);
  isFavorite = signal(false);

  constructor(private movieService: MovieService) {
    this.loadPopularMovies();
  }
  searchMovie(query: string) {
    this.isLoading.set(true);
    this.movieService.searchMovies(query).subscribe({
      next: (movies) => {
        this.movies.set(movies);
        this.isLoading.set(false);
        this.error.set(undefined);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      },
    });
  }
  loadPopularMovies() {
    this.isLoading.set(true);
    this.movieService.getPopularMovies().subscribe({
      next: (movies) => {
        this.movies.set(movies);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      },
    });
  }

  onSelectMovie(movie: MovieData) {
    this.isLoading.set(true);
    this.movieService.getMovie(movie.id).subscribe({
      next: (movieDetails) => {
        this.selectedMovie.set(movieDetails);
        this.checkIfFavorite(movieDetails.id);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      },
    });
  }

  private checkIfFavorite(movieId: number) {
    if (!this.authService.isAuthenticated()) return;

    this.authService.getFavoriteMovies().subscribe({
      next: (movies) => {
        this.isFavorite.set(movies.some((m) => m.id === movieId));
      },
      error: (err) => console.error('Error checking favorites:', err),
    });
  }

  toggleFavorite() {
    if (!this.selectedMovie()) return;

    const movieId = this.selectedMovie()!.id;
    const action = this.isFavorite()
      ? this.authService.removeFromFavorites(movieId)
      : this.authService.addToFavorites(movieId);

    action.subscribe({
      next: () => {
        this.isFavorite.update((v) => !v);
      },
      error: (err) => {
        console.error('Error toggling favorite:', err);
        this.error.set('Failed to update favorites');
      },
    });
  }

  clearSelectedMovie() {
    this.selectedMovie.set(null);
  }
}
