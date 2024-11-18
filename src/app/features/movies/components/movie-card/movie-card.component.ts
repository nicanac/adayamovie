import {
  Component,
  signal,
  inject,
  effect,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MovieData } from '../../../../shared/types/movie-data.type';
import { MovieService } from '../../services/movie.service';
import { StreamingService } from '../../services/streaming.service';
import { StreamingProvider } from '../../../../shared/types/streaming.types';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  animate,
  style,
  transition,
  trigger,
  query,
  stagger,
} from '@angular/animations';

interface ProvidersByType {
  flatrate: StreamingProvider[];
  free: StreamingProvider[];
  buy: StreamingProvider[];
  rent: StreamingProvider[];
}
@Component({
  selector: 'app-movie-card',
  standalone: true,
  providers: [CommonModule],
  animations: [
    trigger('cardContent', [
      transition(':enter', [
        query(
          '.animate-item',
          [
            style({ opacity: 0, transform: 'translateY(10px)' }),
            stagger(50, [
              animate(
                '300ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],

  template: `
    @if (movie(); as movieDetails) {
    <div class="space-y-4">
      <div class="flex gap-6">
        <img
          [src]="'https://image.tmdb.org/t/p/w500' + movieDetails.poster_path"
          [alt]="movieDetails.title"
          class="w-64 h-96 object-cover rounded-lg"
        />
        <div class="flex-1 space-y-4">
          <h2 class="text-2xl font-bold">{{ movieDetails.title }}</h2>
          <p class="text-gray-600">{{ movieDetails.overview }}</p>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Release Date</p>
              <p>{{ movieDetails.release_date }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Rating</p>
              <p>{{ movieDetails.vote_average }}/10</p>
            </div>
          </div>

          @if (providers(); as movieProviders) {
          <div class="mt-4 space-y-4">
            @if (movieProviders.flatrate.length > 0) {
            <div>
              <p class="text-sm text-gray-500 mb-2">Subscription</p>
              <div class="flex flex-wrap gap-2">
                @for (provider of movieProviders.flatrate; track
                provider.provider_id) {
                <div
                  class="flex items-center bg-blue-50 rounded-full px-3 py-1"
                >
                  <img
                    [src]="
                      'https://image.tmdb.org/t/p/original' + provider.logo_path
                    "
                    [alt]="provider.provider_name"
                    class="w-6 h-6 rounded-full"
                  />
                  <span class="ml-2 text-sm">{{ provider.provider_name }}</span>
                </div>
                }
              </div>
            </div>
            } @if (movieProviders.free.length > 0) {
            <div>
              <p class="text-sm text-gray-500 mb-2">Free</p>
              <div class="flex flex-wrap gap-2">
                @for (provider of movieProviders.free; track
                provider.provider_id) {
                <div
                  class="flex items-center bg-green-50 rounded-full px-3 py-1"
                >
                  <img
                    [src]="
                      'https://image.tmdb.org/t/p/original' + provider.logo_path
                    "
                    [alt]="provider.provider_name"
                    class="w-6 h-6 rounded-full"
                  />
                  <span class="ml-2 text-sm">{{ provider.provider_name }}</span>
                </div>
                }
              </div>
            </div>
            } @if (movieProviders.rent.length > 0) {
            <div>
              <p class="text-sm text-gray-500 mb-2">Rent</p>
              <div class="flex flex-wrap gap-2">
                @for (provider of movieProviders.rent; track
                provider.provider_id) {
                <div
                  class="flex items-center bg-orange-50 rounded-full px-3 py-1"
                >
                  <img
                    [src]="
                      'https://image.tmdb.org/t/p/original' + provider.logo_path
                    "
                    [alt]="provider.provider_name"
                    class="w-6 h-6 rounded-full"
                  />
                  <span class="ml-2 text-sm">{{ provider.provider_name }}</span>
                </div>
                }
              </div>
            </div>
            } @if (movieProviders.buy.length > 0) {
            <div>
              <p class="text-sm text-gray-500 mb-2">Buy</p>
              <div class="flex flex-wrap gap-2">
                @for (provider of movieProviders.buy; track
                provider.provider_id) {
                <div
                  class="flex items-center bg-purple-50 rounded-full px-3 py-1"
                >
                  <img
                    [src]="
                      'https://image.tmdb.org/t/p/original' + provider.logo_path
                    "
                    [alt]="provider.provider_name"
                    class="w-6 h-6 rounded-full"
                  />
                  <span class="ml-2 text-sm">{{ provider.provider_name }}</span>
                </div>
                }
              </div>
            </div>
            }
          </div>
          } @else {
          <p class="text-sm text-gray-500 mt-4">
            No streaming providers available
          </p>
          }
        </div>
      </div>
    </div>
    }
  `,
})
export class MovieCardComponent {
  @Input({ required: true }) movieId!: number;
  @Output() close = new EventEmitter<void>();

  movie = signal<MovieData | null>(null);
  providers = signal<ProvidersByType>({
    flatrate: [],
    free: [],
    buy: [],
    rent: [],
  });

  constructor(
    private movieService: MovieService,
    private streamingService: StreamingService
  ) {}

  ngOnInit() {
    this.loadMovieDetails();
  }

  private loadMovieDetails() {
    forkJoin({
      movieDetails: this.movieService.getMovie(this.movieId),
      providers: this.streamingService.getMovieAvailability(this.movieId),
    }).subscribe({
      next: ({ movieDetails, providers }) => {
        this.movie.set(movieDetails);
        this.providers.set({
          flatrate: providers?.results?.['BE']?.flatrate || [],
          free: providers?.results?.['BE']?.free || [],
          buy: providers?.results?.['BE']?.buy || [],
          rent: providers?.results?.['BE']?.rent || [],
        });
      },
      error: (error) => console.error('Error loading movie details:', error),
    });
  }
}
