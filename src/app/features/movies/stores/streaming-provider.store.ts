import { MovieAvailability } from './../../../shared/types/streaming.types';
import { StreamingService } from './../services/streaming.service';
import { Injectable, signal } from '@angular/core';
import { StreamingProvider } from '../../../shared/types/streaming.types';
import { MovieData } from '../../../shared/types/movie-data.type';
import { catchError, forkJoin, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StreamingProviderStore {
  #selectedProviders = signal<number[]>([]);
  #movieStreamingProviders = signal<Record<number, StreamingProvider[]>>({});

  readonly selectedProviders = this.#selectedProviders.asReadonly();
  readonly movieStreamingProviders = this.#movieStreamingProviders.asReadonly();

  constructor(private streamingService: StreamingService) {}

  updateSelectedProviders(providers: number[]) {
    this.#selectedProviders.set(providers);
  }

  loadStreamingProvidersForMovies(movies: MovieData[]) {
    if (!movies.length) return;

    forkJoin(
      movies.map((movie) =>
        this.streamingService.getMovieAvailability(movie.id).pipe(
          map((availability: MovieAvailability) => ({
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
      },
    });
  }
}
