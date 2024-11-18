import { Injectable, signal, computed } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { StreamingService } from '../services/streaming.service';
import { MovieData } from '../../../shared/types/movie-data.type';
import { StreamingProvider } from '../../../shared/types/streaming.types';
import { forkJoin, map, catchError, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieSearchStore {
  #loading = signal(false);
  #error = signal<string | null>(null);
  #movies = signal<MovieData[]>([]);
  #suggestions = signal<MovieData[]>([]);
  #selectedProviders = signal<number[]>([]);
  #movieStreamingProviders = signal<Record<number, StreamingProvider[]>>({});
  #searchHistory = signal<MovieData[]>([]);
  #searchTerm = signal('');

  #selectedMovie = signal<MovieData | null>(null);

  // Public readonly signals
  readonly loading = this.#loading.asReadonly();
  readonly error = this.#error.asReadonly();
  readonly movies = this.#movies.asReadonly();
  readonly suggestions = this.#suggestions.asReadonly();
  readonly selectedProviders = this.#selectedProviders.asReadonly();
  readonly movieStreamingProviders = this.#movieStreamingProviders.asReadonly();
  readonly searchHistory = this.#searchHistory.asReadonly();
  readonly searchTerm = this.#searchTerm.asReadonly();
  readonly selectedMovie = this.#selectedMovie.asReadonly();

  constructor(
    private movieService: MovieService,
    private streamingService: StreamingService
  ) {}

  updateSearchTerm(term: string) {
    this.#searchTerm.set(term);
  }

  addToSearchHistory(movie: MovieData) {
    if (!this.#searchHistory().some((m) => m.id === movie.id)) {
      this.#searchHistory.update((history) => [movie, ...history].slice(0, 5));
    }
  }

  setSelectedMovie(movie: MovieData | null) {
    this.#selectedMovie.set(movie);
    if (movie) {
      // Load additional movie details if needed
      this.movieService.getMovie(movie.id).subscribe({
        next: (fullMovie) => this.#selectedMovie.set(fullMovie),
        error: (err) => {
          console.error('Error loading movie details:', err);
          this.#error.set('Error loading movie details');
        },
      });
    }
  }

  private loadStreamingProvidersForMovies(movies: MovieData[]) {
    if (!movies.length) return;

    this.#loading.set(true);

    forkJoin(
      movies.map((movie) =>
        this.streamingService.getMovieAvailability(movie.id).pipe(
          map((availability) => ({
            movieId: movie.id,
            providers: availability?.results?.['BE']?.flatrate || [],
          })),
          catchError(() => of({ movieId: movie.id, providers: [] }))
        )
      )
    ).subscribe({
      next: (results) => {
        const providers: Record<number, StreamingProvider[]> = {};
        results.forEach(({ movieId, providers: movieProviders }) => {
          providers[movieId] = movieProviders;
        });
        this.#movieStreamingProviders.set(providers);
        this.#loading.set(false);
      },
      error: (err) => {
        console.error('Error loading streaming providers:', err);
        this.#loading.set(false);
      },
    });
  }

  searchMovies(term: string, maxSuggestions: number = 5) {
    if (term.length < 2) {
      this.#suggestions.set([]);
      this.#movies.set([]);
      this.#error.set(null);
      return;
    }

    this.#loading.set(true);
    this.#error.set(null);

    this.movieService
      .searchMovies(term)
      .pipe(
        switchMap((movies) => {
          // Store all movies first
          const sortedMovies = movies.sort(
            (a, b) => b.popularity - a.popularity
          );

          // Set suggestions with limited number
          this.#suggestions.set(sortedMovies.slice(0, maxSuggestions));

          // If no providers selected, return all movies
          if (this.#selectedProviders().length === 0) {
            this.#movies.set(sortedMovies);
            return of({ movies: sortedMovies, providers: {} });
          }

          // Load streaming providers for all movies
          return forkJoin(
            sortedMovies.map((movie) =>
              this.streamingService.getMovieAvailability(movie.id).pipe(
                map((availability) => ({
                  movie,
                  providers: availability?.results?.['BE']?.flatrate || [],
                })),
                catchError(() => of({ movie, providers: [] }))
              )
            )
          ).pipe(
            map((results) => {
              const providers: Record<number, StreamingProvider[]> = {};
              const filteredMovies: MovieData[] = [];

              results.forEach(({ movie, providers: movieProviders }) => {
                providers[movie.id] = movieProviders;

                // Filter movies based on selected providers
                const hasSelectedProvider = movieProviders.some((provider) =>
                  this.#selectedProviders().includes(provider.provider_id)
                );

                if (hasSelectedProvider) {
                  filteredMovies.push(movie);
                }
              });

              return { movies: filteredMovies, providers };
            })
          );
        })
      )
      .subscribe({
        next: ({ movies, providers }) => {
          console.log('Search results:', { movies, providers });
          this.#movies.set(movies);
          this.#movieStreamingProviders.set(providers);
          this.#loading.set(false);
        },
        error: (err) => {
          this.#suggestions.set([]);
          this.#movies.set([]);
          this.#loading.set(false);
          this.#error.set(`API Error: ${err.message}`);
          console.error('Search error:', err);
        },
      });
  }
  updateSelectedProviders(providers: number[]) {
    console.log('Updating selected providers:', providers);
    this.#selectedProviders.set(providers);

    // If we have an active search, refresh the results with new providers
    const currentTerm = this.searchTerm();
    if (currentTerm.length >= 2) {
      this.searchMovies(currentTerm);
    }
  }
  closeMovieDetails() {
    this.#selectedMovie.set(null);
  }
}
