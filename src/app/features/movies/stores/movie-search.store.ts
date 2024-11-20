import { AuthService } from './../../../core/services/auth.service';
import { WatchedMoviesService } from './../services/watched-movie.service';
import { Injectable, signal, computed } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { StreamingService } from '../services/streaming.service';
import { MovieData } from '../../../shared/types/movie-data.type';
import { StreamingProvider } from '../../../shared/types/streaming.types';
import { forkJoin, map, catchError, of, switchMap } from 'rxjs';
import { StreamingProviderStore } from './streaming-provider.store';
import { SearchHistoryStore } from './search-history.store';

@Injectable({
  providedIn: 'root',
})
export class MovieSearchStore {
  #loading = signal(false);
  #error = signal<string | null>(null);
  #movies = signal<MovieData[]>([]);
  #suggestions = signal<MovieData[]>([]);
  #searchTerm = signal('');
  #ratingThreshold = signal<number | null>(null);
  #selectedMovie = signal<MovieData | null>(null);
  #watchedFilter = signal<'all' | 'watched' | 'unwatched'>('all');
  private selectedProviders = signal<number[]>([]);

  // Public readonly signals
  readonly loading = this.#loading.asReadonly();
  readonly error = this.#error.asReadonly();
  readonly movies = computed(() => this.applyFilters(this.#movies()));
  readonly suggestions = this.#suggestions.asReadonly();
  readonly searchTerm = this.#searchTerm.asReadonly();
  readonly selectedMovie = this.#selectedMovie.asReadonly();
  readonly watchedFilter = this.#watchedFilter.asReadonly();

  constructor(
    private movieService: MovieService,
    private streamingProviderStore: StreamingProviderStore,
    private searchHistoryStore: SearchHistoryStore,
    private WatchedMoviesService: WatchedMoviesService,
    private AuthService: AuthService
  ) {}
  
  private applyFilters(movies: MovieData[]): MovieData[] {
    let filteredMovies = [...movies];

    // Apply rating filter
    if (this.#ratingThreshold() !== null) {
      filteredMovies = this.filterMoviesByRating(filteredMovies);
    }

    // Apply watched filter
    const watchedStatus = this.#watchedFilter();
    if (watchedStatus !== 'all') {
      const sessionId = this.AuthService.getSessionId();
      if (!sessionId) return filteredMovies;

      const watchedMovies = this.WatchedMoviesService.getWatchedMovies(
        sessionId
      ).subscribe({
        next: (response) => {
          const watchedSet = new Set(
            response.results.map((movie: any) => movie.id)
          );
          filteredMovies = filteredMovies.filter((movie) => {
            const isWatched = watchedSet.has(movie.id);
            return watchedStatus === 'watched' ? isWatched : !isWatched;
          });
        },
        error: (error) => {
          console.error('Error loading watched movies:', error);
          return filteredMovies;
        },
      });
    }

    // Apply streaming provider filter
    const selectedProviders = this.selectedProviders();
    if (selectedProviders.length > 0) {
      const movieProviders =
        this.streamingProviderStore.movieStreamingProviders();
      filteredMovies = filteredMovies.filter((movie) => {
        const providers = movieProviders[movie.id] || [];
        return selectedProviders.some((id) =>
          providers.some((p) => p.provider_id === id)
        );
      });
    }

    return filteredMovies;
  }
  setWatchedFilter(filter: 'all' | 'watched' | 'unwatched') {
    this.#watchedFilter.set(filter);
  }

  private filterMoviesByRating(movies: MovieData[]): MovieData[] {
    const threshold = this.#ratingThreshold();
    if (threshold === null) return movies;
    return movies.filter((movie) => movie.vote_average >= threshold);
  }
  updateSearchTerm(term: string) {
    this.#searchTerm.set(term);
  }

  setSelectedMovie(movie: MovieData | null) {
    this.#selectedMovie.set(movie);
    if (movie) {
      this.searchHistoryStore.addToSearchHistory(movie);
      this.loadMovieDetails(movie.id);
    }
  }

  private loadMovieDetails(movieId: number) {
    this.movieService.getMovie(movieId).subscribe({
      next: (fullMovie) =>
        this.#selectedMovie.set({ ...fullMovie, videos: [] }),
      error: (err) => {
        console.error('Error loading movie details:', err);
        this.#error.set('Error loading movie details');
      },
    });
  }

  setRatingThreshold(rating: number | null) {
    this.#ratingThreshold.set(rating);
    this.refreshResults();
  }

  private refreshResults() {
    const currentTerm = this.searchTerm();
    if (currentTerm.length >= 2) {
      this.searchMovies(currentTerm);
    }
  }

  searchMovies(term: string) {
    if (term.length < 2) {
      this.clearResults();
      return;
    }

    this.#loading.set(true);
    this.#error.set(null);

    this.movieService.searchMovies(term).subscribe({
      next: (movies) => {
        const filteredMovies = this.filterMoviesByRating(
          movies.map((m) => ({ ...m, videos: [] }))
        );
        this.#movies.set(filteredMovies);
        this.#suggestions.set(filteredMovies.slice(0, 10));
        this.streamingProviderStore.loadStreamingProvidersForMovies(
          filteredMovies
        );
        this.#loading.set(false);
      },
      error: (err) => this.handleError(err),
    });
  }

  private handleError(err: any) {
    console.error('Search error:', err);
    this.#suggestions.set([]);
    this.#movies.set([]);
    this.#loading.set(false);
    this.#error.set(`API Error: ${err.message}`);
  }

  clearResults() {
    this.#movies.set([]);
    this.#suggestions.set([]);
    this.#error.set(null);
  }

  updateSelectedProviders(providers: number[]) {
    this.selectedProviders.set(providers);
  }

  closeMovieDetails() {
    this.setSelectedMovie(null);
  }
}
