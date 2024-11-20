import { WatchedButtonComponent } from './../watched-button/watched-button.component';
import { Component, inject, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieData } from '../../../../shared/types/movie-data.type';
import { AuthService } from '../../../../core/services/auth.service';
import { MovieSearchStore } from '../../stores/movie-search.store';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { WatchedMoviesService } from '../../services/watched-movie.service';

@Component({
  selector: 'app-movie-search-results',
  standalone: true,
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2000ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('2000ms ease-in', style({ opacity: 0 }))]),
    ]),
    trigger('modalContent', [
      transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ transform: 'scale(0.95)', opacity: 0 })
        ),
      ]),
    ]),
  ],
  imports: [CommonModule, MovieCardComponent, WatchedButtonComponent],

  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Search Results</h2>
          <p class="text-sm text-gray-500">
            Found {{ movies().length }} movies
          </p>
        </div>
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        @for (movie of movies(); track movie.id) {
        <div
          class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
        >
          <div class="relative">
            <img
              [src]="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
              [alt]="movie.title"
              class="w-full h-64 object-cover"
            />
            @if (authService.isAuthenticated()) {
            <app-watched-button [movieId]="movie.id" />
            }
          </div>
          <div class="p-4 flex flex-col flex-grow">
            <h3 class="font-semibold text-lg mb-2">{{ movie.title }}</h3>
            <p class="text-gray-600 text-sm mb-2">
              {{ movie.release_date | date : 'yyyy' }}
            </p>
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-gray-500">
                Rating: {{ movie.vote_average | number : '1.1-1' }}
              </span>
              @if (authService.isAuthenticated()) {
              <div class="flex gap-2">
                <!-- Watched Status -->
                <button
                  (click)="toggleWatched(movie)"
                  class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  [class.text-green-600]="watchedMovies().has(movie.id)"
                  [class.text-gray-400]="!watchedMovies().has(movie.id)"
                  [attr.aria-label]="
                    watchedMovies().has(movie.id)
                      ? 'Remove from watched'
                      : 'Mark as watched'
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      [class.hidden]="!watchedMovies().has(movie.id)"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      [attr.fill]="
                        watchedMovies().has(movie.id) ? 'currentColor' : 'none'
                      "
                    />
                    <path
                      [class.hidden]="watchedMovies().has(movie.id)"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>

                <!-- Favorite Status -->
                <button
                  (click)="toggleFavorite(movie)"
                  class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  [class.text-red-600]="favoriteMovies().has(movie.id)"
                  [class.text-gray-400]="!favoriteMovies().has(movie.id)"
                  [attr.aria-label]="
                    favoriteMovies().has(movie.id)
                      ? 'Remove from favorites'
                      : 'Add to favorites'
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      [attr.fill]="
                        favoriteMovies().has(movie.id) ? 'currentColor' : 'none'
                      "
                    />
                  </svg>
                </button>
              </div>

              }
            </div>
            <div class="mt-auto">
              <button
                (click)="openMovieDetails(movie)"
                class="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
        }
      </div>

      @if (searchStore.selectedMovie()) {
      <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        (click)="closeMovieDetails()"
      >
        <div
          class="bg-white rounded-lg  w-full max-h-[90vh] overflow-y-auto m-4"
          (click)="$event.stopPropagation()"
        >
          <div class="p-4 flex justify-between items-center border-b">
            <h3 class="text-xl font-semibold">Movie Details</h3>
            <button
              (click)="closeMovieDetails()"
              class="text-gray-500 hover:text-gray-700"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="p-4">
            <app-movie-card
              [movieId]="searchStore.selectedMovie()!.id"
              (close)="closeMovieDetails()"
            ></app-movie-card>
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class MovieSearchResultsComponent {
  movies = input.required<MovieData[]>();
  favoriteMovies = signal<Set<number>>(new Set());
  watchedMovies = signal<Set<number>>(new Set());

  private readonly watchedMoviesService = inject(WatchedMoviesService);

  constructor(
    protected readonly authService: AuthService,
    protected readonly searchStore: MovieSearchStore
  ) {
    this.initializeMovieStates();
  }

  private initializeMovieStates(): void {
    effect(() => {
      if (!this.authService.isAuthenticated()) {
        this.resetStates();
        return;
      }

      this.loadFavoriteMovies();
      this.loadWatchedMovies();
    });
  }

  private resetStates(): void {
    this.watchedMovies.set(new Set());
    this.favoriteMovies.set(new Set());
  }

  private loadWatchedMovies(): void {
    const sessionId = this.authService.getSessionId();
    if (!sessionId) return;

    this.watchedMoviesService.getWatchedMovies(sessionId).subscribe({
      next: (movies) => {
        this.watchedMovies.set(new Set(movies.map((m: any) => m.id)));
      },
      error: (error) => console.error('Failed to load watched movies:', error),
    });
  }

  private loadFavoriteMovies(): void {
    this.authService.getFavoriteMovies().subscribe({
      next: (movies) => {
        this.favoriteMovies.set(new Set(movies.map((m) => m.id)));
      },
      error: (error) => console.error('Failed to load favorites:', error),
    });
  }

  toggleWatched(movie: MovieData): void {
    const sessionId = this.authService.getSessionId();
    if (!sessionId) return;

    const isWatched = this.watchedMovies().has(movie.id);
    const action = isWatched
      ? this.watchedMoviesService.removeFromWatched(movie.id, sessionId)
      : this.watchedMoviesService.markAsWatched(movie.id, sessionId);

    action.subscribe({
      next: () => this.updateWatchedMovies(movie.id, !isWatched),
      error: (error) =>
        console.error('Failed to toggle watched status:', error),
    });
  }

  private updateWatchedMovies(movieId: number, add: boolean): void {
    const newWatched = new Set(this.watchedMovies());
    add ? newWatched.add(movieId) : newWatched.delete(movieId);
    this.watchedMovies.set(newWatched);
  }

  toggleFavorite(movie: MovieData): void {
    if (!this.authService.isAuthenticated()) return;

    const isFavorite = this.favoriteMovies().has(movie.id);
    const action = isFavorite
      ? this.authService.removeFromFavorites(movie.id)
      : this.authService.addToFavorites(movie.id);

    action.subscribe({
      next: () => this.updateFavoriteMovies(movie.id, !isFavorite),
      error: (error) => console.error('Failed to update favorites:', error),
    });
  }

  private updateFavoriteMovies(movieId: number, add: boolean): void {
    const newFavorites = new Set(this.favoriteMovies());
    add ? newFavorites.add(movieId) : newFavorites.delete(movieId);
    this.favoriteMovies.set(newFavorites);
  }

  openMovieDetails(movie: MovieData): void {
    this.searchStore.setSelectedMovie(movie);
    this.setBodyOverflow('hidden');
  }

  closeMovieDetails(): void {
    this.searchStore.closeMovieDetails();
    this.setBodyOverflow('auto');
  }

  private setBodyOverflow(value: 'hidden' | 'auto'): void {
    document.body.style.overflow = value;
  }
}
