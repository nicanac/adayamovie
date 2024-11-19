import { Injectable, signal } from '@angular/core';
import { MovieData } from '../../../shared/types/movie-data.type';

@Injectable({
  providedIn: 'root',
})
export class SearchHistoryStore {
  #searchHistory = signal<MovieData[]>([]);
  readonly searchHistory = this.#searchHistory.asReadonly();

  addToSearchHistory(movie: MovieData) {
    if (!this.#searchHistory().some((m) => m.id === movie.id)) {
      this.#searchHistory.update((history) => [movie, ...history].slice(0, 5));
    }
  }

  clearHistory() {
    this.#searchHistory.set([]);
  }
}
