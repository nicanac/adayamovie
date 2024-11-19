import { Injectable, signal } from '@angular/core';
import { MovieData } from '../../../shared/types/movie-data.type';
import { MovieService } from '../services/movie.service';
import { StreamingProviderStore } from './streaming-provider.store';

@Injectable({
  providedIn: 'root',
})
export class MovieDiscoverStore {
  #loading = signal(false);
  #error = signal<string | null>(null);
  #movies = signal<MovieData[]>([]);
  #ratingThreshold = signal<number | null>(null);

  readonly loading = this.#loading.asReadonly();
  readonly error = this.#error.asReadonly();
  readonly movies = this.#movies.asReadonly();
  readonly ratingThreshold = this.#ratingThreshold.asReadonly();

  constructor(
    private movieService: MovieService,
    private streamingProviderStore: StreamingProviderStore
  ) {}

  discoverMovies() {
    this.#loading.set(true);
    this.#error.set(null);

    const searchParams = {
      with_watch_providers: this.streamingProviderStore.selectedProviders().join('|'),
      'vote_average.gte': this.#ratingThreshold(),
    };

    this.movieService.discoverMovies(searchParams).subscribe({
      next: (movies) => {
        const filteredMovies = this.filterMoviesByRating(movies as MovieData[]);
        this.#movies.set(filteredMovies);
        this.streamingProviderStore.loadStreamingProvidersForMovies(filteredMovies);
        this.#loading.set(false);
      },
      error: (err) => this.handleError(err)
    });
  }

  setRatingThreshold(rating: number | null) {
    this.#ratingThreshold.set(rating);
    this.discoverMovies();
  }

  private filterMoviesByRating(movies: MovieData[]): MovieData[] {
    if (this.#ratingThreshold() === null) return movies;
    return movies.filter(movie => movie.vote_average >= this.#ratingThreshold()!);
  }

  private handleError(err: any) {
    console.error('Discover error:', err);
    this.#movies.set([]);
    this.#loading.set(false);
    this.#error.set(`API Error: ${err.message}`);
  }

  clearResults() {
    this.#movies.set([]);
    this.#error.set(null);
  }
} 