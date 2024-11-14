import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../features/movies/components/movie-card/movie-card.component';
import { MovieSearchComponent } from '../../features/movies/components/movie-search/movie-search.component';

@Component({
  selector: 'app-movie-page',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, MovieSearchComponent],
  template: `
    <div class="w-96">
      <app-movie-search
        [isLoading]="movieCard.isLoading()"
        [error]="movieCard.error()"
        (searchSubmitted)="movieCard.searchMovie($event)"
      />
    </div>
    <div class="mt-8">
      <app-movie-card #movieCard></app-movie-card>
    </div>
  `,
})
export class MoviePageComponent {}
