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
import { MovieSearchStore } from '../../stores/movie-search.store';
import { RouterLink } from '@angular/router';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { animate, style, transition, trigger } from '@angular/animations';

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
  imports: [CommonModule, MovieCardComponent],

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
          <img
            [src]="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
            [alt]="movie.title"
            class="w-full h-64 object-cover"
          />
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
              <button
                (click)="toggleFavorite(movie)"
                class="text-red-500 hover:text-red-600"
              >
                <svg
                  [class.fill-current]="favoriteMovies().has(movie.id)"
                  class="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
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
          class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto m-4"
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

  constructor(
    protected authService: AuthService,
    protected searchStore: MovieSearchStore
  ) {
    if (this.authService.isAuthenticated()) {
      this.loadFavoriteMovies();
    }
  }

  private loadFavoriteMovies() {
    this.authService.getFavoriteMovies().subscribe({
      next: (movies) => {
        this.favoriteMovies.set(new Set(movies.map((m) => m.id)));
      },
      error: (err) => console.error('Error loading favorites:', err),
    });
  }

  toggleFavorite(movie: MovieData) {
    if (!this.authService.isAuthenticated()) return;

    const isFavorite = this.favoriteMovies().has(movie.id);
    const action = isFavorite
      ? this.authService.removeFromFavorites(movie.id)
      : this.authService.addToFavorites(movie.id);

    action.subscribe({
      next: () => {
        const newFavorites = new Set(this.favoriteMovies());
        if (isFavorite) {
          newFavorites.delete(movie.id);
        } else {
          newFavorites.add(movie.id);
        }
        this.favoriteMovies.set(newFavorites);
      },
      error: (err) => console.error('Error updating favorites:', err),
    });
  }

  openMovieDetails(movie: MovieData) {
    this.searchStore.setSelectedMovie(movie);
    document.body.style.overflow = 'hidden';
  }

  closeMovieDetails() {
    this.searchStore.closeMovieDetails();
    document.body.style.overflow = 'auto';
  }
}
