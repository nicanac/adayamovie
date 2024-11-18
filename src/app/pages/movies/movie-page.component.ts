import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../features/movies/components/movie-card/movie-card.component';
import { MovieSearchComponent } from '../../features/movies/components/movie-search/movie-search.component';
import { MovieSearchStore } from '../../features/movies/stores/movie-search.store';
import { MovieSearchResultsComponent } from '../../features/movies/components/movie-search-results/movie-search-results.component';
import { MovieData } from '../../shared/types/movie-data.type';

@Component({
  selector: 'app-movie-page',
  standalone: true,
  imports: [
    CommonModule,
    MovieCardComponent,
    MovieSearchComponent,
    MovieSearchResultsComponent,
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <app-movie-search
          [isLoading]="searchStore.loading()"
          [error]="searchStore.error() ?? undefined"
          (searchSubmitted)="onMovieSelect($event)"
        />
      </div>
      @if (searchStore.movies().length > 0) {
      <app-movie-search-results [movies]="searchStore.movies()" />
      }
    </div>
  `,
})
export class MoviePageComponent {
  constructor(protected searchStore: MovieSearchStore) {}

  onMovieSelect(movie: MovieData) {
    console.log('Movie page received movie:', movie);
    this.searchStore.searchMovies(movie.title); // This will load all related movies
  }
}
